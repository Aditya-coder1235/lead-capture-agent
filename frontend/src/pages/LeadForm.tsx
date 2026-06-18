import { useState } from "react";

type FormData = {
    fullName: string;
    email: string;
    businessName: string;
    message: string;
};

type Errors = Partial<FormData>;

const LeadForm = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        businessName: "",
        message: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");

    const validate = (): boolean => {
        const newErrors: Errors = {};
        if (!formData.fullName.trim())
            newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = "Invalid email address";
        if (!formData.businessName.trim())
            newErrors.businessName = "Business name is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

   const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       if (!validate()) return;

       setIsLoading(true);
       setServerError("");

       try {
           const res = await fetch("http://localhost:5000/leads", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData),
           });

           const data = await res.json();

           if (!res.ok) {
               if (data.duplicate) {
                   throw new Error(
                       "⚠️ This email has already submitted a lead. Each email can only submit once.",
                   );
               }
               throw new Error(data.error || "Something went wrong");
           }

           setSuccess(true);
           setFormData({
               fullName: "",
               email: "",
               businessName: "",
               message: "",
           });
       } catch (err: any) {
           setServerError(err.message);
       } finally {
           setIsLoading(false);
       }
   };

    const inputClass = (field: keyof Errors) =>
        `w-full px-4 py-3 rounded-xl border-2 bg-white/5 text-white placeholder-gray-500 outline-none transition-all duration-200 ${
            errors[field]
                ? "border-red-500 focus:border-red-400"
                : "border-white/10 focus:border-purple-500"
        }`;

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Get in Touch
                    </h1>
                    <p className="text-gray-400">
                        Tell us about your business and we'll get back to you
                        shortly.
                    </p>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-center">
                        ✓ Your message has been received! We'll be in touch
                        soon.
                    </div>
                )}

                {serverError && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center">
                        {serverError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fullName: e.target.value,
                                })
                            }
                            className={inputClass("fullName")}
                        />
                        {errors.fullName && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className={inputClass("email")}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Business Name
                        </label>
                        <input
                            type="text"
                            placeholder="Acme Inc."
                            value={formData.businessName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    businessName: e.target.value,
                                })
                            }
                            className={inputClass("businessName")}
                        />
                        {errors.businessName && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.businessName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Message
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Tell us about your project or what you're looking for..."
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    message: e.target.value,
                                })
                            }
                            className={`${inputClass("message")} resize-none`}
                        />
                        {errors.message && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Submitting..." : "Submit Lead"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                    <a
                        href="/admin"
                        className="text-purple-400 hover:underline"
                    >
                        Admin Panel →
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LeadForm;
