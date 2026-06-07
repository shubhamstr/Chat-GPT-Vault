import {
    useEffect,
    useState,
} from "react";

interface Note {
    id: string;
    title: string;
    content: string;
}

interface Prompt {
    id: string;
    title: string;
    content: string;
}

export default function App() {
    const [tab, setTab] =
        useState<
            "notes" | "prompts"
        >("notes");

    const [notes, setNotes] =
        useState<Note[]>([]);

    const [prompts, setPrompts] =
        useState<Prompt[]>([]);

    useEffect(() => {
        chrome.storage.local.get(
            ["notes", "prompts"],
            (data: any) => {
                setNotes(
                    data.notes || []
                );

                setPrompts(
                    data.prompts || []
                );
            }
        );
    }, []);

    return (
        <div
            style={{
                width: 400,
                padding: 16,
            }}
        >
            <h2>
                ChatGPT Workspace
            </h2>

            <div>
                <button
                    onClick={() =>
                        setTab(
                            "notes"
                        )
                    }
                >
                    Notes (
                    {
                        notes.length
                    }
                    )
                </button>

                <button
                    onClick={() =>
                        setTab(
                            "prompts"
                        )
                    }
                >
                    Prompts (
                    {
                        prompts.length
                    }
                    )
                </button>
            </div>

            {tab ===
                "notes" &&
                notes.map(
                    (note) => (
                        <div
                            key={
                                note.id
                            }
                        >
                            <h4>
                                {
                                    note.title
                                }
                            </h4>

                            <p>
                                {
                                    note.content
                                }
                            </p>
                        </div>
                    )
                )}

            {tab ===
                "prompts" &&
                prompts.map(
                    (
                        prompt
                    ) => (
                        <div
                            key={
                                prompt.id
                            }
                        >
                            <h4>
                                {
                                    prompt.title
                                }
                            </h4>

                            <p>
                                {
                                    prompt.content
                                }
                            </p>
                        </div>
                    )
                )}
        </div>
    );
}