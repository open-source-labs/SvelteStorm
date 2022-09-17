<script>
  import { scaleLinear } from 'd3-scale';
  const { ipcRenderer } = require('electron');

  let componentRerenderCount = []; 

	ipcRenderer.on('PERFORMANCE', (event, args) => {
		console.log('Args received rerendertracker: ', args)
		console.log('Args.compCount received rerendertracker: ', args.compCounts)
		console.log('Args.body.compCount received rerendertracker: ', args.body.compCounts)
		console.log('Args.body[compCount] received rerendertracker: ', args.body[compCounts])
		console.log('Args.body is: ', args.body)
		console.log('Args[body] is: ', args[body])
		console.log('Args[body].compCount is: ', args[body].compCounts)
    });

	// console.log({componentRerenderCount});

	// 	{Answer5: 2
	// Answer6: 2
	// Answer7: 2
	// Answer8: 2
	// Answer9: 2
	// Answer10: 2
	// App1: 4
	// Bank3: 2
	// Board12: 2
	// Guess13: 2
	// Guess14: 7
	// Question4: 2
	// Team2: 1
	// Team11: 2}

	//{component: e.detail.$$.id, count: e.detail.$$.renderCount}

	const points = [
    { component: 'Answer', count: 5},
    { component: 'App', count: 5},
    { component: 'Bank', count: 15},
    { component: 'Board', count: 5},
    { component: 'Guess', count: 8}, 
    { component: 'Question', count: 9}, 
    { component: 'Team', count: 9}
  ];

	const xTicks = ['Answer', 'App', 'Bank', 'Board', 'Guess', 'Question', 'Team'];
	const yTicks = [0, 5, 10, 15, 20, 25];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	$: xScale = scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;
</script>

<main>
  <h5 class="graph-title">Component Rerender Tracker</h5>
<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<!-- y axis -->
		<g class="axis y-axis">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x2="100%"></line>
					<text y="-4">{tick}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each points as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x="{barWidth/2}" y="-4">{width > 380 ? point.component : formatMobile(point.component)}</text>
				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each points as point, i}
				<rect
					x="{xScale(i) + 2}"
					y="{yScale(point.count)}"
					width="{barWidth - 4}"
					height="{yScale(0) - yScale(point.count)}"
				></rect>
			{/each}
		</g>
	</svg>
</div>
</main>

<style>
  .graph-title {
    color: whitesmoke;
    margin-bottom: 0;
    margin-top: 0;
    padding-top: 50px;
    font-size: 12px;
  }

	.chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: .725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #ccc;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: #8031a7;
        border: 10px solid; 
        border-color: #070608;
		stroke: none;
		opacity: 0.65;
	}
</style>