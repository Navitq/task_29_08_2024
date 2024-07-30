import React, { useEffect, useState, useRef } from 'react';
import Table from './Table';
import Modal from './Modal';

import './styles.css';

const generateColumns = async (): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const count = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
            const columns = Array.from({ length: count }, (_, i) => `Column ${i + 1}`);
            resolve(columns);
        }, 1500);
    });
};

const generateData = async (numColumns: number): Promise<boolean[][]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const numRows = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
            const data = Array.from({ length: numRows }, () =>
                Array.from({ length: numColumns }, () => Math.random() >= 0.5)
            );
            resolve(data);
        }, 1500);
    });
};

const App: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const delStr = useRef<HTMLInputElement>(null);
    const [data, setData] = useState<boolean[][]>([]);
    const [cellColors, setCellColors] = useState<{ [key: string]: string }>({});
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [editMode, setEditMode] = useState<boolean>(false);

    type ColorType = string; // Replace with the actual type if it's different
    type CellColorsType = {
        [key: string]: ColorType;
    };

    useEffect(() => {
        const fetchData = async () => {
            const cols = await generateColumns();
            const rows = await generateData(cols.length);
            setColumns(cols);
            setData(rows);
        };
        fetchData();
    }, []);

    const addRow = () => {
        setEditMode(false);
        setData((prevData) => [
            ...prevData,
            Array.from({ length: columns.length }, () => Math.random() >= 0.5),
        ]);
    };

    const editRow = () => {
        setEditMode(true);
        setModalContent(
            <>
                <p>Are you sure you want to turn on edit mode?</p>

                <button
                    onClick={() => {
                        setShowModal(false);
                    }}
                >
                    Confirm
                </button>
                <button onClick={() => { setShowModal(false); setEditMode(false); }}>Cancel</button>
            </>
        );
        setShowModal(true);
    };

    const handleDeleteRow = (rowIndex: number) => {
        // Update data by filtering out the deleted row
        setData((prevData) => prevData.filter((_, index) => index !== rowIndex));

        // Create a new object to hold updated cell colors
        const newSetColor: CellColorsType = {};

        Object.keys(cellColors).forEach((key) => {
            const [rowIdx, colIdx] = key.split('-').map(Number);
            if (rowIdx < rowIndex) {
                // Rows before the deleted row are unaffected
                newSetColor[key] = cellColors[key];
            } else if (rowIdx > rowIndex) {
                // Shift the row index for rows after the deleted row
                newSetColor[`${rowIdx - 1}-${colIdx}`] = cellColors[key];
            }
        });

        // Set the updated cell colors
        setCellColors(newSetColor);

        // Close the modal
        setShowModal(false);
    };

    const openDeleteModal = () => {
        setModalContent(
            <>
                <p>Which row do you want to delete?</p>
                <input
                    type="number"
                    ref={delStr}
                />
                <button
                    onClick={() => {
                        const rowIndex = Number(delStr.current?.value) - 1;
                        if (rowIndex >= data.length || rowIndex < 0) {
                            setModalContent(
                                <>
                                    <p>Invalid row index!</p>
                                    <button onClick={() => setShowModal(false)}>Cancel</button>
                                </>
                            );
                            return;
                        }
                        handleDeleteRow(rowIndex);
                    }}
                >
                    Confirm
                </button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </>
        );
        setEditMode(true);
        setShowModal(true);
    };

    return (
        <div>
            <Table columns={columns} data={data} editMode={editMode} cellColors={cellColors} setCellColors={setCellColors} />
            <button onClick={addRow}>Add Row</button>
            <button onClick={editRow}>Edit Row</button>
            <button onClick={() => openDeleteModal()}>Delete Row</button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                {modalContent}
            </Modal>
        </div>
    );
};

export default App;
