import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function HLSPlayer({
    videoId,
    hlsPath,
    onTimeUpdate,
    autoPlay = true,
    controls = true,
    className = ""
}) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState('Auto');
    const [availableQualities, setAvailableQualities] = useState([]);
    const [showQualityMenu, setShowQualityMenu] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !hlsPath) return;

        const hlsUrl = `${process.env.REACT_APP_API_URL}/hls/${hlsPath}`;

        if (Hls.isSupported()) {
            // HLS.js for browsers that don't support HLS natively
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
                maxBufferLength: 30,
                maxMaxBufferLength: 600,
                maxBufferSize: 60 * 1000 * 1000, // 60MB
                maxBufferHole: 0.5,
                // Adaptive bitrate settings
                abrEwmaDefaultEstimate: 500000,
                abrBandWidthFactor: 0.95,
                abrBandWidthUpFactor: 0.7,
            });

            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            // Get available quality levels
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const qualities = data.levels.map((level, index) => ({
                    index,
                    height: level.height,
                    bitrate: level.bitrate,
                    label: `${level.height}p`
                }));

                // Sort by quality (highest first)
                qualities.sort((a, b) => b.height - a.height);

                setAvailableQualities([
                    { index: -1, label: 'Auto', height: 0 },
                    ...qualities
                ]);

                console.log('✅ HLS manifest loaded, qualities:', qualities.map(q => q.label));
            });

            // Auto quality switching
            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                const level = hls.levels[data.level];
                if (hls.currentLevel === -1) {
                    console.log(`🔄 Auto quality: ${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`);
                }
            });

            // Error handling
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('❌ Network error, trying to recover...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('❌ Media error, trying to recover...');
                            hls.recoverMediaError();
                            break;
                        default:
                            console.error('❌ Fatal error, cannot recover');
                            hls.destroy();
                            break;
                    }
                }
            });

            hlsRef.current = hls;

            return () => {
                if (hls) {
                    hls.destroy();
                }
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari, iOS)
            video.src = hlsUrl;
            console.log('✅ Using native HLS support');
        } else {
            console.error('❌ HLS not supported in this browser');
        }
    }, [hlsPath]);

    const changeQuality = (qualityIndex) => {
        if (!hlsRef.current) return;

        if (qualityIndex === -1) {
            // Auto quality
            hlsRef.current.currentLevel = -1;
            setCurrentQuality('Auto');
            console.log('🔄 Switched to Auto quality');
        } else {
            hlsRef.current.currentLevel = qualityIndex;
            const quality = availableQualities.find(q => q.index === qualityIndex);
            setCurrentQuality(quality.label);
            console.log(`🔄 Manual quality: ${quality.label}`);
        }
        setShowQualityMenu(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%', background: '#000' }}>
            <video
                ref={videoRef}
                controls={controls}
                autoPlay={autoPlay}
                onTimeUpdate={onTimeUpdate}
                className={className}
                style={{
                    width: '100%',
                    height: 'auto',
                    background: '#000',
                    display: 'block'
                }}
            />

            {/* Quality Selector Overlay */}
            {availableQualities.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: 60,
                    right: 10,
                    zIndex: 10
                }}>
                    <button
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                        style={{
                            background: 'rgba(0,0,0,0.8)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 4,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z" />
                        </svg>
                        {currentQuality}
                    </button>

                    {showQualityMenu && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: 0,
                            marginBottom: 8,
                            background: 'rgba(28,28,28,0.98)',
                            borderRadius: 8,
                            padding: 8,
                            minWidth: 120,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}>
                            {availableQualities.map((quality) => (
                                <button
                                    key={quality.label}
                                    onClick={() => changeQuality(quality.index)}
                                    style={{
                                        width: '100%',
                                        background: currentQuality === quality.label ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        fontSize: 13,
                                        textAlign: 'left',
                                        borderRadius: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span>{quality.label}</span>
                                    {currentQuality === quality.label && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
