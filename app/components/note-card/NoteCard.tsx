"use client";
import { useState, useRef, useEffect } from "react";
import { NoteData } from "../../types/Note";

interface NoteCardProps {
    note: NoteData;
    onUpdateNote: (updatedNote: NoteData) => void;
    onDeleteNote: (noteId: number) => void;
}

const NoteCard = ({ note, onUpdateNote, onDeleteNote }: NoteCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);
    const [editCategory, setEditCategory] = useState(note.category);

    const cardRef = useRef<HTMLDivElement | null>(null);

    const toggleExpand = () => setIsExpanded((prev) => !prev);
    const handleEditClick = () => setIsEditing((prev) => !prev);

    const handleSaveClick = () => {
        setIsEditing(false);
        onUpdateNote({
            ...note,
            title: editTitle,
            content: editContent,
            category: editCategory,
        });
    };

    useEffect(() => {
        if (isExpanded && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [isExpanded]);

    return (
        <div
            {...(isEditing ? {} : { onClick: toggleExpand })}
            ref={cardRef}
            className={`p-4 bg-gray-800 text-white rounded-lg shadow-lg mb-4 transition-all duration-300 ${
                isExpanded ? "w-full h-auto" : "w-72 h-40"
            }`}
        >
            <div className="flex items-center space-x-4">
                <div
                    className={`rounded-full w-4 h-4 ${
                        note.category === 1
                            ? "bg-green-500"
                            : note.category === 2
                            ? "bg-orange-500"
                            : "bg-blue-500"
                    }`}
                ></div>
                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-semibold bg-gray-700 text-white rounded p-2 w-full focus:outline-none"
                        placeholder="Título de la nota"
                    />
                ) : (
                    <h2 className="text-lg font-semibold truncate">{note.title}</h2>
                )}
            </div>

            <div className="mt-4">
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded resize-none"
                        rows={4}
                        placeholder="Escribe tu nota aquí..."
                    />
                ) : (
                    <p className="text-gray-400 truncate">{note.content}</p>
                )}
            </div>

            {isEditing && (
                <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(Number(e.target.value))}
                    className="w-full p-2 bg-gray-700 text-white rounded mt-2"
                >
                    <option value={1}>Ideas</option>
                    <option value={2}>Por hacer</option>
                    <option value={3}>Terminado</option>
                </select>
            )}

            <div className="flex justify-end space-x-4 mt-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSaveClick}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => onDeleteNote(note.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Editar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
