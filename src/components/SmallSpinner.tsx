export const SmallSpinner: React.FC<{}> = () => {
  return (
    <div
      className="inline-block h-2 w-2 animate-spin rounded-full border-2 border-solid border-grey border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
      role="status"
    />
  );
};
