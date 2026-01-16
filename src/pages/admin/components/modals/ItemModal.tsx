import { useEffect, useState } from "react";
import type { TaskOption } from "../../../../types/taskOption";
import MDEditor from "@uiw/react-md-editor";

const formatLanguage = (lang: string): number => {
    //console.log(lang);
    switch (lang) {
        case ('JavaScript'): return 63
        case ('TypeScript'): return 74
        case ('C#'): return 51
        case ('C++'): return 54
        case ('Python'): return 70
        case ('Java'): return 62
        default: return 0
    }

}

export default function ItemModal({ open, onClose, onSave, initial }: any) {
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [type, setType] = useState(initial?.type || "text");
    const [options, setOptions] = useState<TaskOption[]>(initial?.options || ["", "", "", ""]);
    const [correctOption, setCorrectOption] = useState<number>(initial?.correctOption ?? 0);
    const [language, setLanguage] = useState(formatLanguage(initial?.languageName) || 0);
    const [startCode, setCodeStart] = useState(initial?.startCode || "");
    const [correctOutput, setCorrectOutput] = useState(initial?.correctOutput || "");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = "Title is required.";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required.";
        }

        if (!type) {
            newErrors.type = "Task type is required.";
        }

        if (type === "quiz") {
            if (!options || options.length === 0) {
                newErrors.options = "Quiz must contain options.";
            }

            options.forEach((opt, idx) => {
                if (!opt.text?.trim()) {
                    newErrors[`option_${idx}`] = `Option ${idx + 1} cannot be empty.`;
                }
            });

            if (correctOption === -1 || correctOption == null) {
                newErrors.correctOption = "Please select the correct option.";
            }
        }

        if (type === "code") {
            if (!language || language === 0) {
                newErrors.language = "Please select a programming language.";
            }

            if (!correctOutput.trim()) {
                newErrors.correctOutput = "Expected output is required.";
            }
        }

        if (type === "text") {
            if (!correctOutput.trim()) {
                newErrors.correctOutput = "Expected answer is required.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (initial) {
            // console.log(initial)
            setTitle(initial.title);
            setDescription(initial.description);
            setType(initial.type);
            setOptions(initial.options);
            const normalizedOptions = initial.options.map((o: TaskOption) => ({
                ...o,
                isCorrect: Boolean(o.isCorrect),
            }))
            const correctIndx = normalizedOptions.findIndex((o: TaskOption) => o.isCorrect == true);
            setCorrectOption(correctIndx);
            setLanguage(formatLanguage(initial.languageName));
            setCodeStart(initial.startCode);
            setCorrectOutput(initial.correctOutput);
        }
        else {
            setTitle("");
            setDescription("");
            setType("text");
            setOptions([{
                id: 0,
                taskId: 0,
                text: "",
                isCorrect: true,
                order: 1
            }, {
                id: 0,
                taskId: 0,
                text: "",
                isCorrect: false,
                order: 2
            }, {
                id: 0,
                taskId: 0,
                text: "",
                isCorrect: false,
                order: 3
            }, {
                id: 0,
                taskId: 0,
                text: "",
                isCorrect: false,
                order: 4
            }]);
            setCorrectOption(0);
            setCodeStart("");
            setCorrectOutput("");
        }
    }, [initial])

    if (!open) return null;

    const handleSave = () => {
        setErrors({});
        if (!validate()) {

            console.log(errors)
            return;
        };

        let data: any = { title, description, type };

        if (type === "quiz") {
            data = {
                ...data,
                options: options.map((o, idx) => ({
                    ...o,
                    isCorrect: idx === correctOption,
                })),
            };
        }
        else if (type === "code") {
            data = { ...data, language, startCode, correctOutput };
        }
        else if (type === "text") {
            data = { ...data, correctOutput };
        }

        onSave(data);
        console.log("1");
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-full max-w-3xl space-y-4 overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold mb-2">{initial ? "Edit Item" : "Add Item"}</h2>
                <div className="space-y-2">
                    <input
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            errors.title && setErrors(p => ({ ...p, title: "" }));
                        }}
                        className=" bg-white/5 p-2 rounded border border-white/10 outline-none"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    <div className="bg-white/5 rounded border border-white/10">
                        <MDEditor
                            value={description}
                            onChange={setDescription}
                            height={200}
                        />
                    </div>
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                    )}
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-[30%] p-2  rounded bg-white/5 border border-white/10">
                        <option value="text" className="bg-background-light dark:bg-background-dark">Text</option>
                        <option value="quiz" className="bg-background-light dark:bg-background-dark">Quiz</option>
                        <option value="code" className="bg-background-light dark:bg-background-dark">Code</option>
                    </select>


                    {type === "quiz" && options.map((opt, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <div className="flex w-[30%] items-center gap-2">
                                <input
                                    type="radio"
                                    checked={correctOption === idx}
                                    onChange={() => setCorrectOption(idx)}
                                />
                                <input
                                    value={opt.text}
                                    onChange={e => {
                                        const newOpts = [...options];
                                        newOpts[idx].text = e.target.value;
                                        setOptions(newOpts);
                                        errors[`option_${idx}`] && setErrors(p => ({ ...p, [`option_${idx}`]: "" }));
                                    }}
                                    className="flex-1  p-2 bg-white/5 rounded border border-white/10 outline-none"
                                    placeholder={`Option ${idx + 1}`}
                                />
                            </div>
                            {errors[`option_${idx}`] && (
                                <p className="text-red-500 text-xs pl-6">{errors[`option_${idx}`]}</p>
                            )}
                        </div>
                    ))}
                    {errors.correctOption && (
                        <p className="text-red-500 text-sm">{errors.correctOption}</p>
                    )}

                    {type === "code" && (
                        <>
                            {/* <input value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-2 bg-white/5 rounded border border-white/10" placeholder="Language" /> */}
                            <select value={language} onChange={(e) => setLanguage(Number(e.target.value))} className="w-full p-2  rounded bg-white/5 border border-white/10">
                                <option value={0} className="bg-background-light dark:bg-background-dark">Select Language</option>
                                <option value={63} className="bg-background-light dark:bg-background-dark">JavaScript</option>
                                <option value={74} className="bg-background-light dark:bg-background-dark">TypeScript</option>
                                <option value={51} className="bg-background-light dark:bg-background-dark">C#</option>
                                <option value={54} className="bg-background-light dark:bg-background-dark">C++</option>
                                <option value={70} className="bg-background-light dark:bg-background-dark">Python</option>
                            </select>
                            {errors.language && (
                                <p className="text-red-500 text-sm">{errors.language}</p>
                            )}
                            <textarea value={startCode} onChange={e => setCodeStart(e.target.value)} className="w-full p-2 bg-white/5 rounded border border-white/10 h-20 resize-none" placeholder="Starting code" />
                            <textarea value={correctOutput} onChange={e => setCorrectOutput(e.target.value)} className="w-full p-2 bg-white/5 rounded border border-white/10 h-20 resize-none" placeholder="Expected output" />
                            {errors.correctOutput && (
                                <p className="text-red-500 text-sm">{errors.correctOutput}</p>
                            )}

                        </>
                    )}

                    {type === "text" && (
                        <textarea value={correctOutput} onChange={e => setCorrectOutput(e.target.value)} className="w-full p-2 bg-white/5 rounded border border-white/10 h-20 resize-none" placeholder="Expected text" />
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">Save</button>
                </div>
            </div>
        </div>
    );
}