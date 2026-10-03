import { Field } from '../Field/Field.jsx';
import './ListLink.css';

export function ListLink({ url }) {
  if (!url) return null;

  return (
    <Field
      className="list-link"
      id="list-link"
      label="Link da lista"
      readOnly
      value={url}
      onFocus={(event) => event.target.select()}
    />
  );
}
