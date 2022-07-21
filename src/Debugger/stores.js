import { writable } from "svelte/store";

export const snapshots = writable([]);

// To get each component, loop through snapshots[idx].componentStates

// data.body
// {
//     componentStates: [ [ [Object], [Object], 'Task' ], [ [Object], [Object], 'Task' ] ],
//     cacheLength: 2
// }

//componentStates => [component, componentState, component Constructor]
// data.body.componentStates
// [
//     [
//       { '$$': [Object] },
//       {
//         toDoList: {},
//         taskDate: '9/22/2022',
//         task: 'Phone Screen',
//         idx: 1,
//         list: [Array]
//       },
//       'Task'
//     ],
//     [
//       { '$$': [Object] },
//       {
//         toDoList: {},
//         taskDate: '9/23/2022',
//         task: 'Job Interview',
//         idx: 2,
//         list: [Array]
//       },
//       'Task'
//     ]
//   ]
//
//
// ​
// ​
// data.body.componentStates[0]
// [
//     {
//       '$$': {
//         fragment: {},
//         ctx: [Array],
//         props: [Object],
//         bound: {},
//         on_mount: [],
//         on_destroy: [],
//         on_disconnect: [],
//         before_update: [],
//         after_update: [],
//         context: {},
//         callbacks: {},
//         dirty: [Array],
//         skip_bound: false,
//         root: {}
//       }
//     },
//     {
//       toDoList: {},
//       taskDate: '9/22/2022',
//       task: 'Phone Screen',
//       idx: 1,
//       list: [ [Object], [Object] ]
//     },
//     'Task'
//   ]
// ​
// data.body.componentStates[0][0]['$$'].props
// { taskDate: 0, task: 1, idx: 2 }
