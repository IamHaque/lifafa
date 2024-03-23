import Counter from '../Counter';

import { Lifafa } from '../types';
import { formatDate } from '../utils';

interface LifafaClaimSuccessProps {
  lifafa: Lifafa;
  claimedAmount: string;
}

function LifafaClaimSuccess({
  lifafa,
  claimedAmount,
}: LifafaClaimSuccessProps) {
  return (
    <>
      <h2>{lifafa.createdBy}</h2>
      <p className="mb-3">Has send you a Lucky Lifafa. It's your lucky day!</p>

      <h1>
        You Received{' '}
        <Counter
          prefix="₹"
          countFrom={lifafa.initialAmount}
          countTo={parseFloat(claimedAmount)}
        />
      </h1>

      <div className="divider"></div>

      <p className="mb-3">{lifafa.message}</p>

      <small>{formatDate(lifafa.createdAt)}</small>

      <div className="claimed">
        <h3>
          You have claimed{' '}
          <Counter
            prefix="₹"
            countFrom={lifafa.initialAmount}
            countTo={parseFloat(claimedAmount)}
          />{' '}
          of ₹{lifafa.initialAmount}
        </h3>
        <small>{lifafa.remaining} Lifafa yet to be claimed</small>
        <h4>Amount will be credited in your account within 24 hours.</h4>
      </div>
    </>
  );
}

export default LifafaClaimSuccess;
