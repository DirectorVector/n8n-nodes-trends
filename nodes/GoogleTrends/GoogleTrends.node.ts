import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import GoogleTrendsApi from '@alkalisummer/google-trends-js';

export class GoogleTrends implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Trends',
		name: 'googleTrends',
		icon: 'file:google-trends.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Retrieve Google Trends data using @alkalisummer/google-trends-js',
		defaults: {
			name: 'Google Trends',
		},
		inputs: [{ type: NodeConnectionType.Main }],
		outputs: [{ type: NodeConnectionType.Main }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Daily Trends',
						value: 'dailyTrends',
						description: 'Get daily trending topics for a specific region',
						action: 'Get daily trending topics',
					},
					{
						name: 'Real-Time Trends',
						value: 'realTimeTrends',
						description: 'Get real-time trending topics',
						action: 'Get real-time trending topics',
					},
					{
						name: 'Trending Articles',
						value: 'trendingArticles',
						description: 'Get trending articles for specific article keys',
						action: 'Get trending articles',
					},
					{
						name: 'Interest Over Time',
						value: 'interestOverTime',
						description: 'Get interest over time data for a keyword',
						action: 'Get interest over time',
					},
					{
						name: 'Autocomplete',
						value: 'autocomplete',
						description: 'Get search suggestions for a keyword',
						action: 'Get autocomplete suggestions',
					},
					{
						name: 'Explore',
						value: 'explore',
						description: 'Get widget data for a keyword',
						action: 'Explore trends data',
					},
					{
						name: 'Interest by Region',
						value: 'interestByRegion',
						description: 'Get interest data by region',
						action: 'Get interest by region',
					},
				],
				default: 'dailyTrends',
			},

			// Daily Trends options
			{
				displayName: 'Geo Location',
				name: 'geo',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['dailyTrends'],
					},
				},
				default: 'US',
				description: 'Geographic location code (e.g., US, GB, DE)',
			},
			{
				displayName: 'Language',
				name: 'hl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['dailyTrends'],
					},
				},
				default: 'en',
				description: 'Language code (e.g., en, fr, de)',
			},

			// Real-Time Trends options
			{
				displayName: 'Geo Location',
				name: 'geo',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['realTimeTrends'],
					},
				},
				default: 'US',
				description: 'Geographic location code',
			},
			{
				displayName: 'Trending Hours',
				name: 'trendingHours',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['realTimeTrends'],
					},
				},
				default: 4,
				description: 'Number of hours to look back for trending topics',
			},

			// Trending Articles options
			{
				displayName: 'Article Keys',
				name: 'articleKeys',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['trendingArticles'],
					},
				},
				default: '',
				description: 'JSON array of article keys from daily trends',
				placeholder: '[[1, "en", "US"]]',
			},
			{
				displayName: 'Article Count',
				name: 'articleCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['trendingArticles'],
					},
				},
				default: 5,
				description: 'Number of articles to retrieve',
			},

			// Interest Over Time options
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['interestOverTime'],
					},
				},
				default: '',
				description: 'Search keyword',
				required: true,
			},
			{
				displayName: 'Geo Location',
				name: 'geo',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['interestOverTime'],
					},
				},
				default: 'US',
				description: 'Geographic location code',
			},

			// Autocomplete options
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['autocomplete'],
					},
				},
				default: '',
				description: 'Keyword to get suggestions for',
				required: true,
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['autocomplete'],
					},
				},
				default: 'en-US',
				description: 'Language code',
			},

			// Explore options
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['explore'],
					},
				},
				default: '',
				description: 'Search keyword',
				required: true,
			},
			{
				displayName: 'Geo Location',
				name: 'geo',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['explore'],
					},
				},
				default: 'US',
				description: 'Geographic location code',
			},
			{
				displayName: 'Time Range',
				name: 'time',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['explore'],
					},
				},
				default: 'now 1-d',
				description: 'Time range (e.g., "now 1-d", "2025-06-30 2025-07-01")',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['explore'],
					},
				},
				default: 0,
				description: 'Category number',
			},
			{
				displayName: 'Property',
				name: 'property',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['explore'],
					},
				},
				default: '',
				description: 'Property filter',
			},
			{
				displayName: 'Language',
				name: 'hl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['explore'],
					},
				},
				default: 'en-US',
				description: 'Language code',
			},

			// Interest by Region options
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: '',
				description: 'Comma-separated list of keywords or single keyword',
				required: true,
			},
			{
				displayName: 'Start Date',
				name: 'startTime',
				type: 'dateTime',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: '',
				description: 'Start date for the analysis',
			},
			{
				displayName: 'End Date',
				name: 'endTime',
				type: 'dateTime',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: '',
				description: 'End date for the analysis',
			},
			{
				displayName: 'Geo Locations',
				name: 'geoRegions',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: 'US',
				description: 'Comma-separated list of geo codes or single geo code',
			},
			{
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				options: [
					{
						name: 'Country',
						value: 'COUNTRY',
					},
					{
						name: 'Region',
						value: 'REGION',
					},
					{
						name: 'City',
						value: 'CITY',
					},
					{
						name: 'DMA',
						value: 'DMA',
					},
				],
				default: 'REGION',
				description: 'Geographic resolution',
			},
			{
				displayName: 'Language',
				name: 'hl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: 'en-US',
				description: 'Language code',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: -240,
				description: 'Timezone offset in minutes',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['interestByRegion'],
					},
				},
				default: 0,
				description: 'Category number',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				let result: any;

				switch (operation) {
					case 'dailyTrends':
						const dailyGeo = this.getNodeParameter('geo', i) as string;
						const hl = this.getNodeParameter('hl', i) as string;
						result = await GoogleTrendsApi.dailyTrends({
							geo: dailyGeo,
							hl,
						});
						break;

					case 'realTimeTrends':
						const realTimeGeo = this.getNodeParameter('geo', i) as string;
						const trendingHours = this.getNodeParameter('trendingHours', i) as number;
						result = await GoogleTrendsApi.realTimeTrends({
							geo: realTimeGeo,
							trendingHours,
						});
						break;

					case 'trendingArticles':
						const articleKeysStr = this.getNodeParameter('articleKeys', i) as string;
						const articleCount = this.getNodeParameter('articleCount', i) as number;
						let articleKeys;
						try {
							articleKeys = JSON.parse(articleKeysStr);
						} catch {
							throw new NodeOperationError(this.getNode(), 'Invalid article keys format. Expected JSON array.');
						}
						result = await GoogleTrendsApi.trendingArticles({
							articleKeys,
							articleCount,
						});
						break;

					case 'interestOverTime':
						const interestKeyword = this.getNodeParameter('keyword', i) as string;
						const interestGeo = this.getNodeParameter('geo', i) as string;
						result = await GoogleTrendsApi.interestOverTime({
							keyword: interestKeyword,
							geo: interestGeo,
						});
						break;

					case 'autocomplete':
						const autocompleteKeyword = this.getNodeParameter('keyword', i) as string;
						const language = this.getNodeParameter('language', i) as string;
						result = await GoogleTrendsApi.autocomplete(autocompleteKeyword, language);
						break;

					case 'explore':
						const exploreKeyword = this.getNodeParameter('keyword', i) as string;
						const exploreGeo = this.getNodeParameter('geo', i) as string;
						const time = this.getNodeParameter('time', i) as string;
						const category = this.getNodeParameter('category', i) as number;
						const property = this.getNodeParameter('property', i) as string;
						const exploreHl = this.getNodeParameter('hl', i) as string;
						result = await GoogleTrendsApi.explore({
							keyword: exploreKeyword,
							geo: exploreGeo,
							time,
							category,
							property,
							hl: exploreHl,
						});
						break;

					case 'interestByRegion':
						const keywordsStr = this.getNodeParameter('keywords', i) as string;
						const startTime = this.getNodeParameter('startTime', i) as string;
						const endTime = this.getNodeParameter('endTime', i) as string;
						const geoRegionsStr = this.getNodeParameter('geoRegions', i) as string;
						const resolution = this.getNodeParameter('resolution', i) as string;
						const regionHl = this.getNodeParameter('hl', i) as string;
						const timezone = this.getNodeParameter('timezone', i) as number;
						const regionCategory = this.getNodeParameter('category', i) as number;

						// Parse keywords and geo regions
						const keywords = keywordsStr.includes(',') 
							? keywordsStr.split(',').map(k => k.trim())
							: keywordsStr;
						const geoRegions = geoRegionsStr.includes(',')
							? geoRegionsStr.split(',').map(g => g.trim())
							: geoRegionsStr;

						const regionOptions: any = {
							keyword: keywords,
							geo: geoRegions,
							resolution,
							hl: regionHl,
							timezone,
							category: regionCategory,
						};

						if (startTime) {
							regionOptions.startTime = new Date(startTime);
						}
						if (endTime) {
							regionOptions.endTime = new Date(endTime);
						}

						result = await GoogleTrendsApi.interestByRegion(regionOptions);
						break;

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}				returnData.push({
					json: {
						operation,
						data: result,
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							operation,
							error: error.message,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), `Google Trends API error: ${error.message}`);
			}
		}

		return this.prepareOutputData(returnData);
	}
}
