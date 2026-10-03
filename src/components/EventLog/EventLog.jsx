import './EventLog.css';

export function EventLog({ lines, onClear }) {
  return (
    <section className="event-log" aria-labelledby="event-log-title">
      <div className="event-log-head">
        <h2 id="event-log-title">Fila de eventos</h2>
        <button
          type="button"
          className="event-log-clear"
          disabled={lines.length === 0}
          onClick={onClear}
        >
          Limpar
        </button>
      </div>
      <div className="event-log-entries" tabIndex={0}>
        {lines.length > 0 ? (
          <ul aria-live="polite">
            {lines.map((line) => (
              <li key={line.id}>
                <span className="event-log-text">{line.text}</span>
                <time className="event-log-time">{line.time}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="event-log-empty">Não há eventos registrados</p>
        )}
      </div>
    </section>
  );
}
