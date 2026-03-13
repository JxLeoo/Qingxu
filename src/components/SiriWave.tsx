import React, { useEffect, useRef } from 'react';

interface SiriWaveProps {
  analyser: AnalyserNode | null;
}

class Curve {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private color: string;
  private tick: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  private _globalAttenuation = 0.8;
  private _amplitude = 0.5;
  private _speed = 0.1;
  private _frequency = 4;

  private _lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
  }

  private _draw(t: (x: number) => number) {
    this.tick += this._speed;

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;

    for (let i = 0; i <= this.width; i++) {
      const x = i / this.width;
      const y = this.height / 2 + t(x) * this._amplitude * this.height * this._globalAttenuation;
      if (i === 0) {
        this.ctx.moveTo(i, y);
      } else {
        this.ctx.lineTo(i, y);
      }
    }

    this.ctx.stroke();
  }

  public update(volume: number) {
    this._amplitude = this._lerp(this._amplitude, volume, 0.1);
  }
  
  public draw() {
    this._draw((x) => {
      return Math.sin(x * this._frequency * Math.PI * 2 - this.tick);
    });
  }
}

const SiriWave: React.FC<SiriWaveProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const curvesRef = useRef<Curve[]>([]);

  useEffect(() => {
    if (canvasRef.current && analyser) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;
      curvesRef.current = [
        new Curve(ctx, width, height, 'rgba(251, 191, 36, 0.8)'),
        new Curve(ctx, width, height, 'rgba(249, 115, 22, 0.6)'),
        new Curve(ctx, width, height, 'rgba(234, 88, 12, 0.4)'),
      ];

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length / 255;

        ctx.clearRect(0, 0, width, height);
        curvesRef.current.forEach(curve => {
          curve.update(volume * 2);
          curve.draw();
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [analyser]);

  return <canvas ref={canvasRef} width={300} height={120} className="w-full max-w-[280px] h-28 mb-10" />;
};

export default SiriWave;
