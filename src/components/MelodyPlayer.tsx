import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Spin from '../icons/Spin';
import Stop from '../icons/Stop';
import TrebleClef from '../icons/TrebleClef';

type Player = {
	play: () => Promise<void>;
	stop: () => void;
	seek: (seconds: number) => void;
	duration: number;
};

async function createPlayer(abc: string): Promise<Player> {
	const abcjs = (await import('abcjs')).default;

	if (!abcjs.synth.supportsAudio()) {
		throw new Error('Audio playback is not supported in this browser.');
	}

	const visualObj = abcjs.renderAbc('*', abc)[0];
	visualObj.setTiming();

	const synth = new abcjs.synth.CreateSynth();
	await synth.init({
		visualObj,
		options: {
			soundFontUrl: '/soundfonts/',
			soundFontVolumeMultiplier: 3.0,
			chordsOff: true,
		},
	});

	let primed = false;
	const player: Player = {
		duration: visualObj.getTotalTime() || 0,
		play: async () => {
			if (!primed) {
				player.duration = (await synth.prime()).duration;
				primed = true;
			}
			await abcjs.synth.activeAudioContext().resume();
			synth.start();
		},
		stop: () => synth.stop(),
		seek: (seconds) => synth.seek(seconds, 'seconds'),
	};
	return player;
}

type State = 'idle' | 'loading' | 'playing';

export default function MelodyPlayer({ abc }: { abc: string }): React.ReactElement {
	const [state, setState] = useState<State>('idle');
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const playerRef = useRef<Player | null>(null);
	const playerPromise = useRef<Promise<Player> | null>(null);
	const startRef = useRef({ offset: 0, time: 0 });
	const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
	const isMounted = useRef(true);

	function loadPlayer(): Promise<Player> {
		if (!playerPromise.current) {
			playerPromise.current = createPlayer(abc).then((player) => {
				playerRef.current = player;
				if (isMounted.current) setDuration(player.duration);
				return player;
			});
			playerPromise.current.catch(() => (playerPromise.current = null));
		}
		return playerPromise.current;
	}

	useEffect(() => {
		isMounted.current = true;
		loadPlayer().catch(() => {});
		return () => {
			isMounted.current = false;
			clearTickTimer();
			playerRef.current?.stop();
		};
	}, []);

	function clearTickTimer() {
		if (tickTimer.current) {
			clearInterval(tickTimer.current);
			tickTimer.current = null;
		}
	}

	function stop() {
		clearTickTimer();
		playerRef.current?.stop();
		setProgress(0);
		setState('idle');
	}

	function startClock(offset: number) {
		startRef.current = { offset, time: performance.now() };
		clearTickTimer();
		tickTimer.current = setInterval(() => {
			const total = playerRef.current?.duration ?? 0;
			const position = startRef.current.offset + (performance.now() - startRef.current.time) / 1000;
			if (total > 0 && position >= total) stop();
			else setProgress(position);
		}, 250);
	}

	async function play() {
		setState('loading');
		try {
			const player = await loadPlayer();
			if (progress > 0) player.seek(progress);
			await player.play();
			if (!isMounted.current) return;
			setDuration(player.duration);
			setState('playing');
			startClock(progress);
		} catch {
			if (!isMounted.current) return;
			toast.error('Could not play the melody');
			setState('idle');
		}
	}

	function seek(seconds: number) {
		setProgress(seconds);
		playerRef.current?.seek(seconds);
		if (state === 'playing') startClock(seconds);
	}

	const isPlaying = state === 'playing';
	const icon = {
		loading: <Spin className="loading-spinner" size="sm" />,
		playing: <Stop size="sm" />,
		idle: <TrebleClef size="lg" />,
	}[state];

	return (
		<div className="melody-player">
			<button
				onClick={isPlaying ? stop : play}
				disabled={state === 'loading'}
				aria-label={isPlaying ? 'Stop melody' : 'Play melody'}
			>
				{icon}
			</button>
			<input
				type="range"
				aria-label="Melody progress"
				min={0}
				max={duration || 1}
				step={0.1}
				value={progress}
				disabled={!duration}
				onChange={(e) => seek(Number(e.target.value))}
			/>
			<span className="time">
				{Math.floor(progress)}s / {duration ? `${Math.round(duration)}s` : '–'}
			</span>
		</div>
	);
}
