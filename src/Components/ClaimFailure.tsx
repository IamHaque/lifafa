import { Lifafa } from '../types';
import { formatDate } from '../utils';

interface LifafaClaimFailureProps {
  lifafa: Lifafa;
}

function LifafaClaimFailure({ lifafa }: LifafaClaimFailureProps) {
  return (
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
  );
}

export default LifafaClaimFailure;
