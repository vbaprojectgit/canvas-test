import React from 'react';
import DrawingBoard from "./DrawingBoard";
import './Board.css';
import config from './../config/config.json';

export const Board: React.FC = () => {

    return (
        <div className="board-Grid">
            {
                config.images.map((imageKey, index) => (
                    <DrawingBoard index={index} imageUrl={imageKey.image_url} />
                ))
            }
        </div>
    );

};

