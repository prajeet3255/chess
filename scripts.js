const { compute } = dcp;

function addJobEventListeners(job) {
  job.on("readystatechange", (event) => {
    console.log(`New ready state: ${event}`);
  });

  job.on("accepted", () => {
    console.log(`Job accepted by scheduler, waiting for results...`);
    console.log(`Job has id ${job.id}`);
  });

  job.on("console", (event) => {
    console.log("Job console event:", event.message);
  });

  job.on("result", ({ sliceNumber, result }) => {
    console.log(`Received result for slice ${sliceNumber}:`, result);
    console.log(
      "-----------------------------------------------------------------------------\n"
    );
  });
  job.on("complete", (complete) =>
    console.log(`Job completed ${complete.length} slices`)
  );
  job.on("error", (error) => console.log(error));
  job.on("status", (status) => console.log("Status:", status));
}

async function deploy() {
  const inputSet = [];
  for (let i = 0; i < 100; i++) {
    inputSet.push(i);
  }

  async function workFunction(_input, depth) {
    progress(0);

    return { result: i, movePlayed: depth };
  }

  const job = compute.for(inputSet, workFunction, [100]);
  addJobEventListeners(job);
  job.public.name = "Distributed Chess Engine";
  job.public.description = "Making pro-level analysis more accessible";
  job.public.link = "https://github.com/SophiaPerzan/JS-Chess";
  job.estimationSlices = Infinity;
  job.greedyEstimation = true;
  job.requires("dcp-chess/chess.js");
  job.computeGroups = [{ joinKey: "insight", joinSecret: "dcp" }];

  const moveScores = await job.exec(0.005);
  //const moveScores = await job.localExec(31);
}
