import React, { MouseEvent, useEffect, useRef } from 'react';
import './DrawingBoard.css';

export interface DrawingBoardProps {
    imageUrl: string;
    index: number;
}

enum drawingState {
    NotStarted,
    StartPoint,
    Completed,
}

interface DrawingLine {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}


const DrawingBoard: React.FC<DrawingBoardProps> = (props: DrawingBoardProps) => {

    let history: DrawingLine[] = [];

    // save the reference to the canvas html element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let currentDrawing = {
        state: drawingState.NotStarted,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,

    }

    const onCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {

        const rect = (canvasRef.current as unknown as HTMLCanvasElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (currentDrawing.state === drawingState.NotStarted) {

            currentDrawing.x1 = x;
            currentDrawing.y1 = y;
            currentDrawing.state = drawingState.StartPoint;
        }

        else if (currentDrawing.state === drawingState.StartPoint) {
            currentDrawing.x2 = x;
            currentDrawing.y2 = y;
            currentDrawing.state = drawingState.Completed;
        }


        if (currentDrawing.state === drawingState.Completed) {

            let line: DrawingLine = {
                x1: currentDrawing.x1,
                y1: currentDrawing.y1, 
                x2: currentDrawing.x2, 
                y2: currentDrawing.y2
            };

            // draw line on the canvas
            drawHistoryLine(line);

            // push to the history
            history.push(line);

            // save in local storage
            localStorage[props.index] = JSON.stringify(history);

            // clear current drawing state
            currentDrawing = {
                state: drawingState.NotStarted,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,

            }
        }
    };


    const onClearClick = () => {

        //clear output
        console.log("Clear clicked");
        history = [];


        // clear history also on local storage
        localStorage[props.index] = JSON.stringify(history);

        drawImage(props.imageUrl);
    };


    async function drawImage(url: string) {

        let img = new Image();

        img.onload = function () {
            let canvas = canvasRef.current as HTMLCanvasElement;

            if (canvas.getContext) {
                let context = canvas.getContext('2d');

                if (context) {
                    context.drawImage(img, 0, 0,canvas.width, canvas.height);
                }
            }
        };
        img.src = props.imageUrl;

    }


    useEffect(() => {

        let savedHistory: DrawingLine[];

        initializeCanvas();

        // get the history object for this drawing board  
        try {

            savedHistory = JSON.parse(localStorage[props.index]);

            // apply history on canvas
            for (let i = 0; i < savedHistory.length; i++) {
                drawHistoryLine({
                    x1: savedHistory[i].x1,
                    y1: savedHistory[i].y1, 
                    x2:savedHistory[i].x2,
                    y2:savedHistory[i].y2});
            }

        }
        catch (ex) {

            console.debug(`Falied to find drawing hitory data for board ${props.index}`);
            history = [];
        }



    });

    const drawHistoryLine = (line: DrawingLine) => {

        let canvas: HTMLCanvasElement | null = canvasRef.current;

        if (canvas !== null) {

            if (canvas.getContext) {
                let context = canvas.getContext('2d');

                if (context) {
                    // Reset the current path
                    context.beginPath();
                    // Staring point (x1,y1)
                    context.moveTo(line.x1, line.y1);
                    // End point (x2,y2)
                    context.lineTo(line.x2, line.y2);
                    // Make the line visible
                    context.stroke(); 

                }
            }
        }
    };


    return (

        <div className="slot-internal-layout">
            <button onClick={onClearClick} name="clearBtn">Clear</button>
            <canvas ref={canvasRef} key={props.index} onClick={onCanvasClick} width="250" height="300" />
        </div>
    );

};

export default DrawingBoard;