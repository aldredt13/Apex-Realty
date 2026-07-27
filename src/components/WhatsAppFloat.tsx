import Icon from "./Icon";
import { site } from "../data/site";

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={site.whatsapp.link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <Icon name="whatsapp" />
      <span className="wa-float__label">Chat with us</span>
    </a>
  );
}
