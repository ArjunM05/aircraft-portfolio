import { githubUrl } from '../profile';
import {
	asdTelemetryBars,
	sentimentTelemetryBars,
	veggieVisionTelemetryBars
} from '../telemetry-presets';
import type { AiMlSection } from '../types';

export const aiMlSection: AiMlSection = {
	kind: 'ai-ml',
	id: 'ai-ml',
	menuLabel: 'AI/ML',
	title: 'AI and machine learning',
	aircraftPartName: 'Engines',
	partExplanation:
		'Engines turn fuel into thrust. Machine learning turns data into predictions and powers everything else on board.',
	hasSampleContent: false,
	technologies: [
		'Python',
		'PyTorch',
		'YOLOv8',
		'YOLOv11',
		'RNN',
		'LSTM',
		'CNN',
		'Attention networks',
		'Random Forest',
		'HAAR cascades'
	],
	usedIn: [
		{ sectionId: 'internships', label: 'Annam.AI, TVS Credit, Vividobots' },
		{ sectionId: 'projects', label: 'ASD, Sentiment, VeggieVision' }
	],
	gauges: [
		{ percent: 98, displayValue: '98%', label: 'ASD detection accuracy' },
		{ percent: 18, displayValue: '+18%', label: 'F1 from multimodal fusion' },
		{ percent: 91, displayValue: '91%', label: 'VeggieVision accuracy' }
	],
	projects: [
		{
			title: 'From model to production',
			subtitle: 'Training to client, end to end',
			facts: [
				{
					label: 'Idea',
					text: 'A model is only useful when something can call it. The model is AI/ML, the API is backend and the client is frontend.'
				}
			],
			flowSteps: [
				'Train (PyTorch / YOLO)',
				'Model artifact',
				'Flask inference API',
				'React or Android client'
			],
			technologies: [],
			disciplines: ['backend', 'frontend'],
			isSample: false,
			startsOpen: true
		},
		{
			title: 'Autism Spectrum Disorder Detection',
			subtitle: 'Attention networks | 98% accuracy',
			facts: [
				{ label: 'Data', text: 'Patient MRI scans.' },
				{
					label: 'Model',
					text: 'Custom attention networks extract features, and a random forest ensemble makes the prediction.'
				},
				{ label: 'Result', text: '98% detection accuracy.' }
			],
			flowSteps: ['MRI scans', 'Attention network', 'Random forest', 'Prediction'],
			technologies: ['Python', 'PyTorch', 'Random Forest', 'Deep Learning'],
			disciplines: [],
			isSample: false,
			sourceCodeUrl: githubUrl,
			extras: [
				{
					kind: 'telemetry',
					bars: asdTelemetryBars
				}
			]
		},
		{
			title: 'Multimodal Sentiment Analysis',
			subtitle: 'RNN, LSTM, CNN | +18% F1-score',
			facts: [
				{
					label: 'Data',
					text: 'Text, audio and video inputs synchronized for real-time model inference.'
				},
				{ label: 'Model', text: 'RNN, LSTM and CNN models combined with feature fusion.' },
				{ label: 'Result', text: 'F1-score up 18% over single-modality models.' }
			],
			flowSteps: ['Text (LSTM)', 'Audio (RNN)', 'Video (CNN)', 'Feature fusion', 'Sentiment'],
			technologies: ['Python', 'RNN', 'LSTM', 'CNN'],
			disciplines: [],
			isSample: false,
			sourceCodeUrl: githubUrl,
			extras: [
				{
					kind: 'telemetry',
					bars: sentimentTelemetryBars
				}
			]
		},
		{
			title: 'Pest detection with YOLOv11',
			subtitle: 'Computer vision | Annam.AI',
			facts: [
				{ label: 'Data', text: 'Images submitted through the web application.' },
				{ label: 'Model', text: 'YOLOv11 for real-time detection.' },
				{ label: 'Serving', text: 'Flask REST endpoints consumed by a React front end.' }
			],
			flowSteps: ['Image upload', 'YOLOv11', 'Detections', 'React UI'],
			technologies: ['Python', 'YOLOv11', 'Flask', 'React'],
			disciplines: ['backend', 'frontend'],
			isSample: false
		},
		{
			title: 'VeggieVision detection',
			subtitle: 'YOLOv8 | personal project',
			facts: [
				{ label: 'Data', text: 'Produce photos from an Android app.' },
				{
					label: 'Model',
					text: 'A custom YOLOv8 model for object detection and weight estimation.'
				},
				{ label: 'Result', text: '91% accuracy in real time.' }
			],
			flowSteps: ['Photo', 'YOLOv8', 'Weight estimate'],
			technologies: ['Python', 'YOLOv8', 'Android'],
			disciplines: ['backend'],
			isSample: false,
			sourceCodeUrl: githubUrl,
			extras: [
				{
					kind: 'telemetry',
					bars: veggieVisionTelemetryBars
				}
			]
		},
		{
			title: 'Data prep for generative AI',
			subtitle: 'Python automation | TVS Credit',
			facts: [
				{ label: 'Data', text: 'Unstructured enterprise manuals.' },
				{
					label: 'Approach',
					text: 'Python scripts parse, extract and chunk the text for a generative AI chatbot.'
				},
				{ label: 'Result', text: '25% faster text processing.' }
			],
			flowSteps: ['Manuals', 'Parse', 'Extract', 'Chunk', 'Chatbot'],
			technologies: ['Python'],
			disciplines: ['backend'],
			isSample: false,
			extras: [
				{
					kind: 'telemetry',
					bars: [
						{ label: 'Text processing speed, before', barPercent: 80, displayValue: 'baseline' },
						{ label: 'With the automation scripts (+25%)', barPercent: 100, displayValue: '+25%' }
					]
				}
			]
		}
	]
};
