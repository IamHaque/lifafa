import searchIcon from '../assets/search_svg.svg';

import { Lifafa } from '../types';
import { formatDate } from '../utils';

interface LifafaClaimProps {
  upiId: string;
  lifafa: Lifafa;
  loading: boolean;
  error: string | null;
  success: string | null;
  claimLoading: boolean;
  handleClaim: () => void;
  handleVerification: () => void;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LifafaClaim({
  error,
  upiId,
  lifafa,
  success,
  loading,
  handleInput,
  handleClaim,
  claimLoading,
  handleVerification,
}: LifafaClaimProps) {
  return (
    <>
      <h2>{lifafa.createdBy}</h2>
      <p className="mb-3">Has send you a Lucky Lifafa. It's your lucky day!</p>

      <h1>Lifafa Contains ₹{lifafa?.initialAmount}</h1>

      <div className="divider"></div>

      <p className="mb-3">{lifafa.message}</p>

      <small>{formatDate(lifafa.createdAt)}</small>

      <div className="claim">
        <div
          className={`inputForm ${error && 'error'} ${success && 'success'}`}
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
  );
}

export default LifafaClaim;
