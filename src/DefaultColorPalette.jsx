import React, { useState } from "react";
import { RgbStringColorPicker } from "react-colorful";
import { getTranslator } from './i18n.jsx';

const COLORS = [
    // 💜 Morado Pastel
    '#FFFFFF', '#E0C6FF', '#D1A3FF', '#BB80F2', '#9C66D1', '#7A4DB3',
    // 💙 Azul oscuro Pastel
    '#66A3CC', '#558FBA', '#447AA7', '#336699', '#224477', '#112244',
    // 🌸 Rosa Pastel
    '#D9D9D9', '#FFCCE1', '#FF99CC', '#FF66B8', '#E64D9C', '#B33D7A',
    // 💙 Azul Pastel
    '#E0F5FF', '#B3E6FF', '#80D4FF', '#4DC2FF', '#26A3E6', '#1A87C2',
    // 🌹 Rojo Pastel
    '#A6A6A6', '#FFA6A6', '#FF8080', '#FF4D4D', '#E63333', '#B32424',
    // 🌿 Verde Pastel
    '#66CC66', '#55B955', '#449944', '#337733', '#226622', '#114411',
    // 🧡 Naranja Pastel
    '#595959', '#FFD1A3', '#FFB366', '#FF9933', '#E67A00', '#B35C00',
    // 🌿 Verde Pastel
    '#E0FFE0', '#B3FFB3', '#80FF80', '#4DDB4D', '#26B826', '#1A991A',
    // 🌼 Amarillo Pastel
    '#1A1A1A', '#FFF5B3', '#FFF280', '#FFE44D', '#E6C926', '#B39D1A',
];

export default function DefaultColorPalette({ value, onChange, colors = COLORS }) {
    const [showPicker, setShowPicker] = useState(false);

    const t = getTranslator();

    return (
        <div className="pt-4">
            <label className="block text-sm font-medium text-token-text-primary mb-2">
                {t.changeColor_folder_modal.color}
            </label>

            <div className="flex flex-wrap gap-2 items-center">
                {colors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-sm border border-token-border-medium ${value === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                            }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                            //setShowPicker(false);
                            onChange(color);
                        }}
                    />
                ))}

                <label
                    className="w-8 h-8 rounded-sm border border-token-border-medium justify-center items-center flex cursor-pointer"
                    onClick={() => setShowPicker(!showPicker)}
                >
                    +
                </label>
            </div>
            <div className="mt-4 relative">
                {showPicker && (
                    <div className="mt-2">
                        <RgbStringColorPicker
                            color={value}
                            onChange={(newColor) => onChange(newColor)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}


