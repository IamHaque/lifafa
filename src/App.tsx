import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';

import closedEnvelope from './assets/envelope_closed.png';
import openEnvelope from './assets/envelope_open.png';
import searchIcon from './assets/search_svg.svg';

const DEV_URL = 'http://localhost:3000/lifafa';
const PROD_URL = 'https://lifafa-server.vercel.app/lifafa';
const BASE_URL = PROD_URL;

interface Lifafa {
  count: number;
  message?: string;
  lifafaId: string;
  createdBy: string;
  createdAt: string;
  remaining: number;
  errorMessage?: string;
  initialAmount: number;
  claimedAmount: number;
  remainingAmount: number;
}

export default function App() {
  const [upiId, setUpiId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [lifafa, setLifafa] = useState<Lifafa | null>(null);
  const [lifafaId, setLifafaId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [claimLoading, setClaimLoading] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState<string | null>(null);

  function formatDate(dt: string) {
    return moment(dt).format('D MMM, YYYY hh:mm a');
  }

  useEffect(() => {
    const getLifafa = async () => {
      if (!lifafaId) return;

      axios
        .get(`${BASE_URL}/${lifafaId}`)
        .then((response) => {
          const lifafaData = response?.data;
          if (lifafaData) setLifafa(lifafaData);
        })
        .catch((error) => {
          console.error(error.response);
          setLifafa(null);
        });
    };

    const searchParams = new URLSearchParams(document.location.search);
    const LIFAFA_ID = searchParams.get('lifafaId');
    if (!LIFAFA_ID) return;

    setLifafaId(LIFAFA_ID);

    let localLifafa = localStorage.getItem('lifafa_' + LIFAFA_ID);

    if (!localLifafa) {
      getLifafa();
      return;
    }

    const { claimedAmount, ...lifafaData } = JSON.parse(localLifafa);
    setClaimedAmount(claimedAmount);
    setLifafa(lifafaData);
  }, [lifafaId]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleInput = (e: any) => {
    if (loading) return;

    setError(null);
    setSuccess(null);
    setLoading(false);
    setUpiId(e.target.value);
  };

  const handleVerification = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    axios
      .post(`${BASE_URL}/verifyUpiId`, {
        upiId,
      })
      .then((response) => {
        const { isVerified, accountName } = response?.data;
        if (!isVerified) return setError('Invalid UPI ID');
        setSuccess(accountName);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) setError(errorMessage);
        else setError('Unknown error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClaim = () => {
    setClaimLoading(true);
    setClaimedAmount(null);

    axios
      .post(`${BASE_URL}/claim`, {
        upiId,
        lifafaId,
        accountName: success,
      })
      .then((response) => {
        const { claimedAmount, ...lifafaData } = response?.data;
        if (!claimedAmount) {
          setSuccess(null);
          setError('Error claiming lifafa');
        }

        setClaimedAmount(claimedAmount);
        setLifafa(lifafaData);

        const { createdBy, initialAmount, remaining } = lifafaData;
        localStorage.setItem(
          'lifafa_' + lifafaId,
          JSON.stringify({ claimedAmount, createdBy, initialAmount, remaining })
        );
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          setSuccess(null);
          setError(errorMessage);
        }
      })
      .finally(() => {
        setClaimLoading(false);
      });
  };

  return (
    <div className="container">
      <img
        alt="envelope"
        className="envelope"
        onClick={handleClick}
        src={isOpen ? openEnvelope : closedEnvelope}
      />

      <div
        className="wrapper"
        data-visible={`${isOpen ? 'visible' : 'hidden'}`}
      >
        {lifafa && !lifafa.errorMessage && !claimedAmount && (
          <>
            <h2>{lifafa.createdBy}</h2>
            <p className="mb-3">
              Has send you a Lucky Lifafa. It's your lucky day!
            </p>

            <h1>Lifafa Contains ₹{lifafa?.initialAmount}</h1>

            <div className="divider"></div>

            <p className="mb-3">{lifafa.message}</p>

            <small>{formatDate(lifafa.createdAt)}</small>

            <div className="claim">
              <div
                className={`inputForm ${error && 'error'} ${
                  success && 'success'
                }`}
              >
                <div>
                  <input
                    value={upiId}
                    onChange={handleInput}
                    placeholder="Enter UPI ID"
                  />

                  <button disabled={loading} onClick={handleVerification}>
                    <img src={searchIcon} alt="Verify" />
                  </button>
                </div>
                {error && <small className="error">{error}</small>}
                {success && <small className="success">{success}</small>}
                {!error && !success && <small>eg, 9127382733@ybl</small>}
              </div>

              {!success ? (
                <></>
              ) : success && claimLoading ? (
                <button disabled>Loading...</button>
              ) : (
                <button onClick={handleClaim}>Claim Lifafa</button>
              )}
            </div>
          </>
        )}

        {lifafa && !lifafa.errorMessage && claimedAmount && (
          <>
            <h2>{lifafa.createdBy}</h2>
            <p className="mb-3">
              Has send you a Lucky Lifafa. It's your lucky day!
            </p>

            <h1>You Received ₹{claimedAmount}</h1>

            <div className="divider"></div>

            <p className="mb-3">{lifafa.message}</p>

            <small>{formatDate(lifafa.createdAt)}</small>

            <div className="claimed">
              <h3>
                You have claimed ₹{claimedAmount} of ₹{lifafa.initialAmount}
              </h3>
              <small>{lifafa.remaining} Lifafa yet to be claimed</small>
              <h4>Amount will be credited within 24 hours.</h4>
            </div>
          </>
        )}

        {lifafa && lifafa.errorMessage && (
          <>
            <h2>{lifafa.createdBy}</h2>
            <p className="mb-3">
              Had send you a Lucky Lifafa. It could have been your lucky day!
            </p>

            <h1>It's Gone Now</h1>

            <div className="divider"></div>

            <p className="mb-3">{lifafa.message}</p>

            <small>{formatDate(lifafa.createdAt)}</small>

            <div className="claimed error">
              <h3>Unhunh! You're late.</h3>
              <small>All the lifafas are already claimed!</small>
            </div>
          </>
        )}

        {!lifafa && (
          <>
            <br />
            <br />
            <h1>No Lifafa Found!</h1>
            <br />
            <p>The lifafa you are trying to open does not exist!</p>
            <br />
            <br />
          </>
        )}
      </div>
    </div>
  );
}
