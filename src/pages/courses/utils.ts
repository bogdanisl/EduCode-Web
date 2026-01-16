import type { Course } from "../../types/course";

function removeIds<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(removeIds) as T;
    }

    if (data !== null && typeof data === "object") {
        const result: any = {};
        for (const [key, value] of Object.entries(data)) {
            if (key === "id") continue;
            if (key === "createdBy") continue;
            if (key === "createdAt") continue;
            if (key === "updatedAt") continue;
            
            result[key] = removeIds(value);
        }
        return result;
    }

    return data;
}

export function downloadJson(data: Course) {
    const cleanedData = removeIds(data);

    const json = JSON.stringify(cleanedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title}.json`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}