"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { NoteData } from "./types/Note";
import NoteList from "./components/note-list/NoteList";
import Sidebar from "./components/sidebar/Sidebar";
import NoteStats from "./components/note-stats/NoteStats";

export default function Home() {
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterId, setFilterId] = useState<number>(0);

    // Fetch notes from Supabase
    useEffect(() => {
        const fetchNotes = async () => {
            setIsLoading(true);
            const query = supabase
                .from("notes")
                .select("*")
                .order("created_at", { ascending: false });

            if (filterId !== 0) query.eq("category", filterId);

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching notes:", error.message);
            } else {
                const processedNotes = (data || []).map((note) => ({
                    ...note,
                    created_at: new Date(note.created_at),
                }));
                setNotes(processedNotes);
            }

            setIsLoading(false);
        };

        fetchNotes();
    }, [filterId]);

    // Handle adding a new note
    const handleAddNote = async () => {
        const newNote = {
            title: "",
            content: "",
            category: 1,
            created_at: new Date().toISOString(),
            status: 0,
        };

        const temporaryId = Math.random();
        setNotes([{ id: temporaryId, ...newNote, created_at: new Date() }, ...notes]);

        const { data, error } = await supabase
            .from("notes")
            .insert(newNote)
            .select()
            .single();

        if (error) {
            console.error("Error adding note to Supabase:", error.message);
            setNotes((currentNotes) =>
                currentNotes.filter((note) => note.id !== temporaryId)
            );
        } else if (data) {
            setNotes((currentNotes) =>
                currentNotes.map((note) =>
                    note.id === temporaryId
                        ? { ...data, created_at: new Date(data.created_at) }
                        : note
                )
            );
        }
    };

    const updateNote = async (updatedNote: NoteData) => {
        const updatedNotes = notes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);

        if (updatedNote.id.toString().includes(".")) {
            if (updatedNote.title === "" && updatedNote.content === "") {
                setNotes((notes) =>
                    notes.filter((note) => note.id !== updatedNote.id)
                );
                return;
            }

            const { data, error } = await supabase
                .from("notes")
                .insert({
                    title: updatedNote.title,
                    content: updatedNote.content,
                    category: updatedNote.category,
                    status: updatedNote.status || 0,
                })
                .select()
                .single();

            if (!error && data) {
                setNotes((notes) =>
                    notes.map((note) =>
                        note.id === updatedNote.id
                            ? { ...data, created_at: new Date(data.created_at) }
                            : note
                    )
                );
            }
        } else {
            await supabase
                .from("notes")
                .update({
                    title: updatedNote.title,
                    content: updatedNote.content,
                    category: updatedNote.category,
                    status: updatedNote.status || 0,
                })
                .eq("id", updatedNote.id);
        }
    };

    const deleteNote = async (noteId: number) => {
        setNotes(notes.filter((note) => note.id !== noteId));
        const { error } = await supabase.from("notes").delete().eq("id", noteId);

        if (error) {
            console.error("Error deleting note:", error.message);
        }
    };

    return (
        <div className="flex flex-row h-screen bg-gradient-to-r from-grayPrimary to-graySecondary">
            <div className="w-60 border-r shadow-xl bg-primaryBlack text-neonGreen">
                <Sidebar onFilterChange={setFilterId} />
            </div>
            <div className="flex flex-col w-full bg-primaryBlack text-neonGreen">
                <div className="p-6 flex justify-between items-center bg-graySecondary shadow-lg">
                    <NoteStats notes={notes} />
                    <button
                        onClick={handleAddNote}
                        className="bg-neonGreen text-primaryBlack px-6 py-3 rounded-full font-bold shadow-md transition-transform transform hover:scale-105 hover:bg-emeraldGreen"
                    >
                        + Agregar Nota
                    </button>
                </div>
                <div className="flex-1 p-6">
                    {isLoading ? (
                        skeletonLoader()
                    ) : notes.length === 0 ? (
                        <p className="text-2xl font-semibold text-center text-emeraldGreen animate-pulse">
                            No hay notas en esta categoría...
                        </p>
                    ) : (
                        <NoteList
                            notes={notes}
                            onUpdateNote={updateNote}
                            onDeleteNote={deleteNote}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

const skeletonLoader = () => {
    return (
        <div className="w-full h-screen flex p-6 space-x-4">
            {[1, 2, 3, 4].map((_, i) => (
                <div
                    key={i}
                    className="shadow-md rounded-lg h-44 bg-grayPrimary w-1/4 animate-pulse"
                ></div>
            ))}
            <span className="sr-only">Loading...</span>
        </div>
    );
};