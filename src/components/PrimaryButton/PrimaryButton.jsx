import './PrimaryButton.css';

export function PrimaryButton({ children, ...props }) {
  return (
    <button className="primary-button" type="submit" {...props}>
      {children}
    </button>
  );
}
