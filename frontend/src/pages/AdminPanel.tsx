import { useEffect, useState } from "react";

type Lead = {
    _id: string;
    fullName: string;
    email: string;
    businessName: string;
    message: string;
    aiScore: "Hot" | "Warm" | "Cold" | null;
    aiReason: string | null;
    emailDraft: string | null;
    createdAt: string;
};

const scoreColors = {
    Hot: "bg-red-500/20 text-red-400 border border-red-500/30",
    Warm: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Cold: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const AdminPanel = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch(
                    "https://lead-capture-agent.onrender.com/",
                );
                const data = await res.json();
                setLeads(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeads();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Admin Panel
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {leads.length} leads captured
                        </p>
                    </div>
                    <a
                        href="/"
                        className="text-purple-400 hover:underline text-sm"
                    >
                        ← Back to Form
                    </a>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {(["Hot", "Warm", "Cold"] as const).map((score) => (
                        <div
                            key={score}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                        >
                            <p className="text-2xl font-bold text-white">
                                {
                                    leads.filter((l) => l.aiScore === score)
                                        .length
                                }
                            </p>
                            <p
                                className={`text-sm font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${scoreColors[score]}`}
                            >
                                {score}
                            </p>
                        </div>
                    ))}
                </div>

                {isLoading ? (
                    <p className="text-gray-400 text-center">
                        Loading leads...
                    </p>
                ) : leads.length === 0 ? (
                    <p className="text-gray-400 text-center">No leads yet.</p>
                ) : (
                    <div className="space-y-4">
                        {leads.map((lead) => (
                            <div
                                key={lead._id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-white font-semibold">
                                                {lead.fullName}
                                            </h3>
                                            {lead.aiScore && (
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreColors[lead.aiScore]}`}
                                                >
                                                    {lead.aiScore}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            {lead.email}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {lead.businessName}
                                        </p>
                                        {lead.aiReason && (
                                            <p className="text-gray-500 text-xs mt-2 italic">
                                                "{lead.aiReason}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600 text-xs">
                                            {new Date(
                                                lead.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                        {lead.emailDraft && (
                                            <button
                                                onClick={() =>
                                                    setExpandedId(
                                                        expandedId === lead._id
                                                            ? null
                                                            : lead._id,
                                                    )
                                                }
                                                className="text-purple-400 text-xs hover:underline mt-2"
                                            >
                                                {expandedId === lead._id
                                                    ? "Hide draft"
                                                    : "View email draft"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/5">
                                    <p className="text-gray-400 text-sm">
                                        {lead.message}
                                    </p>
                                </div>

                                {expandedId === lead._id && lead.emailDraft && (
                                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                                        <p className="text-purple-400 text-xs font-medium mb-2">
                                            AI Generated Email Draft
                                        </p>
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                            {lead.emailDraft}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
