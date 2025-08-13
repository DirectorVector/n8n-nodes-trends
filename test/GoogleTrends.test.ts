import { GoogleTrends } from '../nodes/GoogleTrends/GoogleTrends.node';

describe('GoogleTrends Node', () => {
	let node: GoogleTrends;

	beforeEach(() => {
		node = new GoogleTrends();
	});

	it('should have correct node description properties', () => {
		expect(node.description.displayName).toBe('Google Trends');
		expect(node.description.name).toBe('googleTrends');
		expect(node.description.group).toContain('transform');
		expect(node.description.properties).toBeDefined();
		expect(node.description.properties.length).toBeGreaterThan(0);
	});

	it('should have operation parameter as first property', () => {
		const operationProperty = node.description.properties[0];
		expect(operationProperty.name).toBe('operation');
		expect(operationProperty.type).toBe('options');
		expect(operationProperty.options).toBeDefined();
		expect(Array.isArray(operationProperty.options)).toBe(true);
	});

	it('should have all expected operations', () => {
		const operationProperty = node.description.properties[0];
		const operations = operationProperty.options?.map((op: any) => op.value) || [];

		expect(operations).toContain('dailyTrends');
		expect(operations).toContain('realTimeTrends');
		expect(operations).toContain('trendingArticles');
		expect(operations).toContain('interestOverTime');
		expect(operations).toContain('autocomplete');
		expect(operations).toContain('explore');
		expect(operations).toContain('interestByRegion');
	});

	it('should have proper input and output configuration', () => {
		expect(node.description.inputs).toBeDefined();
		expect(node.description.outputs).toBeDefined();
		expect(Array.isArray(node.description.inputs)).toBe(true);
		expect(Array.isArray(node.description.outputs)).toBe(true);
	});
});
