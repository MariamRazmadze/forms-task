import { useState, type FormEvent } from "react";

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
};

const TraditionalControlledForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username || username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("🎉 API Response:", data);
        setSuccessMessage(`User created successfully! (User ID: ${data.id})`);
        setUsername("");
        setEmail("");
        setPassword("");
        setErrors({});
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setErrors({ general: "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">
        Traditional Controlled Components
      </h1>
      <p className="text-gray-600 mb-8">
        This uses the old-school React way with useState for each field
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="username" className="block mb-2 font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            className={`w-full px-3 py-2 text-base rounded-md ${
              errors.username
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {errors.username && (
            <div id="username-error" className="text-red-500 text-sm mt-1" role="alert">{errors.username}</div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full px-3 py-2 text-base rounded-md ${
              errors.email
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {errors.email && (
            <div id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email}</div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full px-3 py-2 text-base rounded-md ${
              errors.password
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {errors.password && (
            <div id="password-error" className="text-red-500 text-sm mt-1" role="alert">{errors.password}</div>
          )}
        </div>

        {errors.general && (
          <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-md text-red-600" role="alert" aria-live="polite">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-5 bg-green-50 border border-green-200 rounded-md text-green-600" role="alert" aria-live="polite">
            {successMessage}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2.5 text-base font-medium text-white rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit to DummyJSON API"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-base font-medium text-blue-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TraditionalControlledForm;
