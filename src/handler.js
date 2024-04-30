const { nanoid } = require('nanoid');  // import third party library utk membuat unique id
const notes = require('./notes');

// fungsi add note
const addNoteHandler = (request, h) => {
    // menyimpan catatan baru yang dikirimkan oleh client melalui body request
    const { title, tags, body } = request.payload;

    // tambahkan object yang belum di-input oleh client
    const noteId = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        id: noteId, title, tags, body, createdAt, updatedAt,
    };

    // push newNote ke array notes
    notes.push(newNote);

    // cek apakah newNote sudah masuk ke array notes, lalu beri response
    const isSuccess = notes.filter((note) => note.id === noteId).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// fungsi get all notes
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

// fungsi get note by id
const getNoteByIdHandler = (request, h) => {
    // dapatkan id note dari parameter request
    const { id } = request.params;

    // get object note by id
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

// fungsi update note by id
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        /* Baris notes[index] = {...} menggantikan catatan yang ada di index tersebut dengan catatan yang telah diperbarui. 
        Penggunaan spread syntax (...) digunakan untuk mempertahankan properti-properti lain dari catatan yang tidak berubah.
        */

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// fungsi delete note by id
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler
};