<script>
  import { scaleLinear } from 'd3-scale';
  import { slide } from 'svelte/transition';
  const { ipcRenderer } = require('electron');

  //next steps: how to auto resize graph or increase the size at least
    //adjust chart size so labels aren't cut off 
	//conditional formatting = if y axis exceeds 50, increment axis by 10s, if exeeds 200, increment by 50 
	//lighten the dotted lines (maybe make transparent)
	//incorporate start/stop button 
	// IDEAL WORLD: flip x and y axis

	ipcRenderer.on('PERFORMANCE', (event, args) => {
		countObj = args.body.compCounts;
		populateRerenderCountArr(countObj); 
	});

  let componentRerenderCountArr = []; 
  let countObj;
  let xTicks = [];
  let yTicks = [0, 5, 10, 15, 20, 25]; 

    //Uses countObj data to populate componentRerenderCountArr, yTicks, and xTicks for D3 chart 
    const populateRerenderCountArr = (obj) => {
		const yAxisStarterMax = yTicks[yTicks.length-1]; 
		let newMaxYAxis = yAxisStarterMax; 
		const tempRenderCountArr = []; 
		const newYTicks = [...yTicks]; 
		const newXTicks = []; 

		for (const key in obj) {
        	tempRenderCountArr.push({
        	      component: key, 
        	      count: obj[key],
        	  });
			  newXTicks.push(key);
			if (Number(obj[key]) > yAxisStarterMax) newMaxYAxis = Number(obj[key]); 
		}

		componentRerenderCountArr = [...tempRenderCountArr];
		xTicks = [...newXTicks]; 
		
		if (newMaxYAxis > yAxisStarterMax) {
			newMaxYAxis = Math.ceil(newMaxYAxis/10)*10;
			let i = yAxisStarterMax + 5;

			while (i <= newMaxYAxis) {
				newYTicks.push(i); 
				i += 5; 
			}
			yTicks = [...newYTicks];
		}
	}

	const padding = { top: 20, right: 15, bottom: 45, left: 25 };

	let width = 500;
	let height = 300;

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
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})" transition="all 1s" >
					<line x2="100%"></line>
					<text y="-4" transition="all 1s">{tick}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each componentRerenderCountArr as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})" justify-content="center">
					<text 
					x="{barWidth/2}" 
					y="-4"
					>
					{width > 380 ? point.component : formatMobile(point.component)}
				</text>
				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each componentRerenderCountArr as point, i}
				<rect
					x="{xScale(i) + 2}"
					y="{yScale(point.count)}"
					width="{barWidth - 4}"
					height="{yScale(0) - yScale(point.count)}"
					out:slide="{{duration: 1000}}"
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
		height: 300px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: .725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e261; 		
		stroke-dasharray: 3;
	}

	.tick text {
		fill: #ccc; 
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
		stroke: #ffffff7d;
	}

	.x-axis .tick text {
		transform: translate(0, -20px) rotate(-30deg);
		text-anchor: end;
	}

	.bars rect {
		fill: #8031a7;
		stroke: none;
		opacity: 0.65;
		transition: all 1s;
	}

</style>