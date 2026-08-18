import Icon from "./Icon";
import { useSettings } from "../context/SettingsContext";

export default function WhatsAppFloat() {
  const settings = useSettings();
  return (
    <a
      className="wa-float"
      href={settings.whatsapp.link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <Icon name="whatsapp" />
      <span className="wa-float__label">Chat with us</span>
    </a>
  );
}
