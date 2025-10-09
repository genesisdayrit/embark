import { useState } from "react";
import Nav from "./components/Nav";
import "./App.css";
import { Section } from "./components/SettingsSection";
import { Switch } from "../components/ui/switch"

function Settings() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center m-auto w-[60%]">
        <p className="text-4xl font-bold border-b-1 border-gray-300 w-full p-10">Account Settings</p>
        <Section>
          <Section.Left>Account Summary</Section.Left>
          <Section.Right>
            <Section.Row label="Email">user@email.com</Section.Row>
            <Section.Row label="Payment Plan">free</Section.Row>
            <Section.Row label="Payment Card">Apple</Section.Row>
            <Section.Row label="Billing Address">NY, USA</Section.Row>
          </Section.Right>
        </Section>

        <Section>
          <Section.Left>Notification</Section.Left>
          <Section.Right>
            <Section.Row>
              <Switch />
            </Section.Row>
          </Section.Right>
        </Section>

        <Section>
          <Section.Left>Dark Mode</Section.Left>
          <Section.Right>
            <Section.Row>on/off</Section.Row>
          </Section.Right>
        </Section>
      </div>
    </>
  );
}

export default Settings;
