import axios from 'axios';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion';

import openEnvelope from './assets/envelope_open.png';
import closedEnvelope from './assets/envelope_closed.png';

import { Lifafa } from './types';
import { BASE_URL, API_HEADER, largeExplosion } from './utils';
import { claimLifafa, getLifafaById } from './service';

import LifafaClaim from './Components/Claim';
import LifafaNotFound from './Components/NotFound';
import LifafaClaimFailure from './Components/ClaimFailure';
import LifafaClaimSuccess from './Components/ClaimSuccess';

export default function App() {
  const { width, height } = useWindowSize();

  const [upiId, setUpiId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [lifafa, setLifafa] = useState<Lifafa | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [hasClaimed, setHasClaimed] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [numberOfPieces, setNumberOfPieces] = useState(200);
  const [claimedAmount, setClaimedAmount] = useState<string | null>(null);

  useEffect(() => {
    const fetchLifafa = async () => {
      const searchParams = new URLSearchParams(document.location.search);
      const LIFAFA_ID = searchParams.get('lifafaId');
      if (!LIFAFA_ID) return;

      let localLifafa = localStorage.getItem('lifafa_' + LIFAFA_ID);

      if (!localLifafa) {
        try {
          const lifafaData = await getLifafaById(LIFAFA_ID);
          if (lifafaData) setLifafa(lifafaData);
        } catch (err: any) {
          setLifafa(null);
        }
        return;
      }

      const { claimedAmount, ...lifafaData } = JSON.parse(localLifafa);

      setLifafa(lifafaData);
      setClaimedAmount(claimedAmount);
    };

    fetchLifafa();
  }, []);

  const celebrate = () => {
    setHasClaimed(true);

    setTimeout(() => {
      setNumberOfPieces(0);
    }, 3000);

    setTimeout(() => {
      setHasClaimed(false);
    }, 5000);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    setIsExploding(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;

    setError(null);
    setSuccess(null);
    setLoading(false);
    setUpiId(e.target.value);
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/verifyUpiId`,
        { upiId },
        API_HEADER
      );
      const { isVerified, accountName, provider } = response.data;
      if (!isVerified) return setError('Invalid UPI ID');
      setSuccess(accountName || provider);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || 'Unable to validate UPI ID';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setClaimLoading(true);
    setClaimedAmount(null);

    try {
      const { claimedAmount, ...lifafaData } = await claimLifafa(
        upiId,
        lifafa?._id,
        success
      );
      if (!claimedAmount) {
        setSuccess(null);
        setError('Error claiming lifafa');
      }

      celebrate();

      setClaimedAmount(claimedAmount);
      setLifafa(lifafaData);

      const { _id, createdBy, remaining, initialAmount } = lifafaData;
      localStorage.setItem(
        'lifafa_' + _id,
        JSON.stringify({ claimedAmount, createdBy, initialAmount, remaining })
      );
    } catch (err: any) {
      setSuccess(null);
      setError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="container">
      {hasClaimed && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={numberOfPieces}
        />
      )}

      <div className="envelope">
        <div>{isExploding && <ConfettiExplosion {...largeExplosion} />}</div>

        <img
          alt="envelope"
          onClick={handleClick}
          src={isOpen ? openEnvelope : closedEnvelope}
          data-visible={`${isOpen ? 'hidden' : 'visible'}`}
        />
      </div>

      <div
        className="wrapper"
        data-visible={`${isOpen ? 'visible' : 'hidden'}`}
      >
        {lifafa && !lifafa.errorMessage && !claimedAmount && (
          <LifafaClaim
            error={error}
            upiId={upiId}
            lifafa={lifafa}
            success={success}
            loading={loading}
            handleInput={handleInput}
            handleClaim={handleClaim}
            claimLoading={claimLoading}
            handleVerification={handleVerification}
          />
        )}

        {lifafa && !lifafa.errorMessage && claimedAmount && (
          <LifafaClaimSuccess lifafa={lifafa} claimedAmount={claimedAmount} />
        )}

        {lifafa && lifafa.errorMessage && (
          <LifafaClaimFailure lifafa={lifafa} />
        )}

        {!lifafa && <LifafaNotFound />}
      </div>
    </div>
  );
}
