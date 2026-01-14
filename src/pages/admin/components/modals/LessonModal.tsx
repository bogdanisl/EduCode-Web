import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";


export default function LessonModal({ open, onClose, onSave, initial }: any) {
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");

    useEffect(() => {
        if (initial) {
            setTitle(initial.title);
            setDescription(initial.description);
        }
        else {
            setTitle("");
            setDescription("");
        }
    }, [initial])

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-full max-w-7xl space-y-4">
                <h2 className="text-xl font-bold mb-2">{initial ? "Edit lesson" : "Add new lesson"}</h2>

                <div className="space-y-2">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 p-2 rounded border border-white/10 outline-none"
                        placeholder="Lesson title"
                    />
                    <div className="bg-white/5 rounded border border-white/10">
                        <MDEditor
                            value={description}
                            onChange={setDescription}
                            height={200}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10">
                        Cancel
                    </button>
                    <button type="button" onClick={() => onSave({ title, description })} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}