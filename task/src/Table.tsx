import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Table.css';

interface TableProps {
    columns: string[];
    data: boolean[][];
    editMode: boolean;
    cellColors: { [key: string]: string };
    setCellColors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const Table: React.FC<TableProps> = ({ columns, data, editMode, cellColors, setCellColors }) => {

    useEffect(() => {
        const initialCellColors: { [key: string]: string } = {};
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellKey = `${rowIndex}-${cellIndex}`;
                if (!(cellKey in cellColors)) {
                    initialCellColors[cellKey] = cell ? 'cell-lightgreen' : 'cell-lightcoral';
                }
            });
        });
        setCellColors(prevColors => ({ ...prevColors, ...initialCellColors }));
    }, [data, setCellColors]);

    const handleCellClick = (rowIndex: number, cellIndex: number) => {
        if (!editMode) return;

        const cellKey = `${rowIndex}-${cellIndex}`;
        setCellColors(prevColors => ({
            ...prevColors,
            [cellKey]: prevColors[cellKey] === 'cell-lightgreen' ? 'cell-lightcoral' : 'cell-lightgreen',
        }));
    };

    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    {columns.map((col) => (
                        <th key={uuidv4()}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={uuidv4()}>
                        <td>Row {rowIndex + 1}</td>
                        {row.map((cell, cellIndex) => {
                            const cellKey = `${rowIndex}-${cellIndex}`;
                            const cellClass = cellColors[cellKey];
                            return (
                                <td
                                    key={uuidv4()}
                                    className={cellClass}
                                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                                >
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
