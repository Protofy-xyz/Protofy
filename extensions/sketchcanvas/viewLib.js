function sketch(card) {
    return reactCard(`

function Widget() {
    const [activeCard, cardEvents] = useActiveCard();
    const opacity = activeCard ? 0.8 : 0;
    const canvasRef = React.useRef(null);    
    const color = getComputedStyle(document.documentElement).getPropertyValue('--color9').trim();
    const firstLoadRef = React.useRef(0);
    const timerRef = React.useRef(null);

    function undo() {
        if (canvasRef.current) {
            canvasRef.current.undo();
        }
    }

    function clear() {
        if (canvasRef.current) {
            canvasRef.current.eraseAll();
        }
    }

    React.useEffect(() => {
        if (canvasRef.current && data.drawing) {
            data.setCardState({ oldData: data.drawing });
            if(data?.cardState?.reDrawn) {
                data.setCardState({ reDrawn: false });
                return;
            }
            const drawingData = JSON.parse(data.drawing);
            console.log("Loading drawing data", drawingData?.lines?.length);
            firstLoadRef.current = drawingData?.lines?.length
            setTimeout(() => {
                canvasRef.current.loadSaveData(data.drawing);
            }, 100)
        }
    }, [data.drawing]);

        return <div className="no-drag" {...cardEvents} style={{ height: "100%", padding: "3px" }}>
            <Tinted>
                <CanvasDraw onChange={() => {
                    const savedData = canvasRef.current.getSaveData();

                    if(firstLoadRef.current > 0) {
                        firstLoadRef.current--;
                        return;
                    }



                    const newData = JSON.parse(canvasRef.current.getSaveData());

                    if(JSON.stringify(JSON.parse(data?.cardState?.oldData ?? '{}')) !=  JSON.stringify(newData)) {
                        data.setCardState({ reDrawn: true });
                        data.setCardState({ oldData: canvasRef.current.getSaveData() });
                        //throttle the save to every 500ms
                        if(timerRef.current) {
                            clearTimeout(timerRef.current);
                        }
                        timerRef.current = setTimeout(() => {
                            data.setCardData({drawing: canvasRef.current.getSaveData()}, false);
                        }, 500);
                    }

                }} hideInterface={true} ref={canvasRef} hideGridY={true} hideGridX={true} backgroundColor='var(--bgPanel)' className="no-drag" style={{ width: "100%", height: "100%" }} brushRadius={2} lazyRadius={6} brushColor={color} />
                <div style={{ position: "absolute", top: '10px', right: '10px', opacity: opacity, transition: 'opacity 0.3s ease-in-out' }}>
                    <InteractiveIcon onPress={undo} Icon="undo" IconColor='var(--color)' size={24} style={{  }} />
                    <InteractiveIcon onPress={clear} Icon="circle-x" IconColor='var(--color)' size={24} style={{ marginBottom: "10px" }} />
                </div>
            </Tinted>
        </div>
}

    `, card.domId)
}
