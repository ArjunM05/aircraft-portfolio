import { githubUrl } from '../profile';
import type { ProjectsSection } from '../types';

export const projectsSection: ProjectsSection = {
	kind: 'projects',
	id: 'projects',
	menuLabel: 'Projects',
	title: 'Projects',
	aircraftPartName: 'Cargo hold',
	partExplanation:
		'The cargo hold carries the payload an aircraft exists to deliver. These are things I delivered.',
	hasSampleContent: false,
	githubUrl,
	projects: [
		// {
		// 	title: 'Shipment Tracking Platform',
		// 	subtitle: 'LogiTrans | -40% manual tracking time',
		// 	facts: [
		// 		{ label: 'Problem', text: 'Manual shipment tracking was slow and error-prone.' },
		// 		{
		// 			label: 'Approach',
		// 			text: 'REST APIs in ASP.NET MVC and C#, an Angular front end, and PostgreSQL queries tuned from query plans.'
		// 		},
		// 		{
		// 			label: 'Result',
		// 			text: '40% less manual processing and 25% better data load efficiency.'
		// 		}
		// 	],
		// 	flowSteps: ['Angular UI', 'REST API', 'Service layer', 'PostgreSQL'],
		// 	technologies: ['C#', 'ASP.NET MVC', 'Angular', 'PostgreSQL'],
		// 	disciplines: ['frontend', 'backend'],
		// 	isSample: true,
		// 	sourceCodeUrl: githubUrl,
		// 	relatedSection: { sectionId: 'backend', label: 'Systems schematic' },
		// 	startsOpen: true
		// },
		{
			title: 'Autism Spectrum Disorder Detection',
			subtitle: '98% detection accuracy',
			facts: [
				{ label: 'Problem', text: 'Screening from MRI scans is slow and subjective.' },
				{
					label: 'Approach',
					text: 'An attention network extracts features and a random forest ensemble classifies them.'
				},
				{ label: 'Result', text: '98% detection accuracy.' }
			],
			flowSteps: ['MRI scans', 'Attention network', 'Random forest', 'Prediction'],
			technologies: ['Python', 'PyTorch', 'Random Forest', 'Deep Learning'],
			disciplines: ['ai-ml'],
			isSample: false,
			startsOpen: true
		},
		{
			title: 'AgroSaarthi - AI powered agricultural assistant',
			subtitle: 'Hackathon - Annam.AI - IIT Ropar',
			facts: [
				{ label: 'Problem', text: 'Farmers struggle to find the right pesticide and vendor.' },
				{
					label: 'Approach',
					text: 'A cloud-based smart pest-detection web & android application'
				},
				{ label: 'Result', text: '91% pest-identification accuracy.' }
			],
			flowSteps: ['YOLOv11 model', 'REST endpoint', 'Pest identification', 'Pesticide suggestion'],
			technologies: ['Machine Learning', 'YOLOv11', 'Flask', 'React'],
			disciplines: ['frontend', 'backend', 'ai-ml'],
			isSample: false,
			sourceCodeUrl: 'https://github.com/ArjunM05/agrisaarthi_application'
		},
		{
			title: 'Multimodal Sentiment Analysis Pipeline',
			subtitle: '18% F1-score boost',
			facts: [
				{
					label: 'Problem',
					text: 'Single-modality models miss context carried by tone and expression.'
				},
				{
					label: 'Approach',
					text: 'Text, audio and video inputs synchronized and combined with feature fusion.'
				},
				{ label: 'Result', text: 'F1-score up 18% over single-modality models.' }
			],
			flowSteps: ['Text (LSTM)', 'Audio (RNN)', 'Video (CNN)', 'Feature fusion', 'Sentiment'],
			technologies: ['Python', 'RNN', 'LSTM', 'CNN'],
			disciplines: ['ai-ml']
		},
		{
			title: 'VeggieVision: API and Weight Estimation App',
			subtitle: '91% real-time accuracy',
			facts: [
				{ label: 'Problem', text: 'Estimating produce weight normally needs a scale.' },
				{
					label: 'Approach',
					text: 'YOLOv8 detects the item and a backend API serves predictions to an Android app.'
				},
				{ label: 'Result', text: '91% accuracy in real-time detection and weight estimation.' }
			],
			flowSteps: ['Android app', 'REST API', 'YOLOv8', 'Weight estimate'],
			technologies: ['Python', 'YOLOv8', 'Android'],
			disciplines: ['ai-ml', 'backend'],
			isSample: false,
			sourceCodeUrl: 'https://github.com/ArjunM05/Veggie_Vision'
		}
	]
};
