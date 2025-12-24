import { useState } from "react";
import { Tabs } from "antd";
import "./App.css";
import AntdControlledForm from "./components/AntdControlledForm";
import NativeActionForm from "./components/NativeActionForm";
import TraditionalControlledForm from "./components/TraditionalControlledForm";
import ReactHookFormZod from "./components/ReactHookFormZod";

function App() {
  const [activeTab, setActiveTab] = useState("antd");

  const items = [
    {
      key: "antd",
      label: "Ant Design",
      children: <AntdControlledForm />,
    },
    {
      key: "rhf",
      label: "React Hook Form + Zod",
      children: <ReactHookFormZod />,
    },
    {
      key: "action",
      label: "Action Prop",
      children: <NativeActionForm />,
    },
    {
      key: "controlled",
      label: "Traditional",
      children: <TraditionalControlledForm />,
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold text-center mb-8">
        React Forms: Four Approaches
      </h1>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        centered
        size="large"
      />
    </div>
  );
}

export default App;
