import CountUp from 'react-countup';

interface CounterProps {
  prefix: string;
  countTo: number;
  countFrom: number;
}

function Counter({ prefix, countTo, countFrom }: CounterProps) {
  return (
    <CountUp
      delay={1}
      duration={3}
      end={countTo}
      prefix={prefix}
      start={countFrom}
    />
  );
}

export default Counter;
