'use-client'

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

interface PdfViewerProps {
    pdfFile: File | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFile }) => {
    const [pdf, setPdf] = useState<any>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const renderPDF = async () => {
            if (pdfFile) {
                const arrayBuffer = await pdfFile.arrayBuffer();
                const loadedPdf = await getDocument({ data: arrayBuffer }).promise;
                setPdf(loadedPdf);
                renderPage(1);
            }
        };

        const renderPage = async (pageNum: number) => {
            if (pdf) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1 });
                const canvas = canvasRef.current;
                if (canvas) {
                    const context = canvas.getContext('2d');
                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        page.render(renderContext);
                    }
                }
            }
        };

        renderPDF();
    }, [pdfFile]);

    useEffect(() => {
        if (pdf) {
            renderPage(pageNumber);
        }
    }, [pageNumber]);

    const renderPage = async (pageNum: number) => {
        if (pdf) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                if (context) {
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    page.render(renderContext);
                }
            }
        }
    };

    const nextPage = () => {
        if (pdf && pageNumber < pdf.numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pdf && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    console.log(canvasRef)

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
            <div>
                <button onClick={prevPage} disabled={pageNumber <= 1}>
                    Previous
                </button>
                <button onClick={nextPage} disabled={pdf && pageNumber >= pdf.numPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PdfViewer;
