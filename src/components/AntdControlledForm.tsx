import { Form, Input, Button, message } from "antd";
import type { FormProps } from "antd";
type FormValues = {
  username: string;
  email: string;
  password: string;
};

const AntdControlledForm = () => {
  const [form] = Form.useForm<FormValues>();

  const onFinish: FormProps<FormValues>["onFinish"] = async (values) => {
    console.log("✅ Form submitted with values:", values);

    try {
      const hideLoading = message.loading("Submitting to DummyJSON API...", 0);

      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      hideLoading();

      if (response.ok) {
        console.log("🎉 API Response:", data);
        message.success("User created successfully!");
        message.info(`Created user with ID: ${data.id}`);
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      message.error("Failed to submit. Please try again.");
    }
  };

  const onFinishFailed: FormProps<FormValues>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("❌ Validation failed:", errorInfo);
    message.error("Please fix the errors in the form");
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">Ant Design Form</h1>
      <p className="text-gray-600 mb-8">
        This form uses Ant Design's Form component which handles state management for you
      </p>
      <Form
        form={form}
        name="basic-controlled-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please enter your username",
            },
            {
              min: 3,
              message: "Username must be at least 3 characters",
            },
          ]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input placeholder="example@email.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-3">
            <Button type="primary" htmlType="submit" size="large" className="flex-1">
              Submit to DummyJSON API
            </Button>
            <Button onClick={() => form.resetFields()} size="large">
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AntdControlledForm;
