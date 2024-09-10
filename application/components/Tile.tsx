'use client'

import { useGameStore } from "@/lib/gameState";
import { type Tile } from "@/types/logic";
import React, { useEffect, useState } from "react";

export default function ATile( {
        tile, 
        index, 
        triggerTileShake, 
    } : { 
        tile: Tile; 
        index: number; 
        triggerTileShake: (index: number) => void;
    }) {
    const [shake, setShake] = useState(false)

    const shakeStyles = {
        animation: 'shake 0.5s',
        animationIterationCount: '1',
    }

    const keyframes = `
      @keyframes shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
      }
    `
    useEffect(() => {
        const stylesheet = document.styleSheets[0]
        stylesheet.insertRule(keyframes, stylesheet.cssRules.length)

        return () => {
            if (stylesheet.cssRules.length > 0) {
                stylesheet.deleteRule(stylesheet.cssRules.length - 1)
            }
        }
    }, [])
    
    useEffect(() => {
        if (shake) {
            const timer = setTimeout(() => setShake(false), 500)
            return () => clearTimeout(timer)
        }
    }, [shake])

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ tile, index }));
    }

    return (
        <div
        style={{
            ...shakeStyles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'grab',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            padding: '8px',
            margin: '0px 6px',
            textAlign: 'center',
            transition: 'background-color 0.7s',
            ...(shake && { backgroundColor: '#e9ecef' })
        }}
            draggable
            onDragStart={handleDragStart}
        >
            {tile?.letter}<span className="mx-1 text-xs">{tile?.points}</span>
        </div>
    )
}


