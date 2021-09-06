module.exports = (shipit) => {
  shipit.initConfig({
    default: {
      workspace: "/root",
      dockerHub: "congvan203/my-blog-api",
    },
    latest: {
      servers: [
        {
          host: "ktalk-digital",
          user: "root",
        },
      ],
      branch: "master",
      tag: "latest",
      dockerfile: "Dockerfile",
    },
  });

  shipit.task("default", async () => {
    const { branch, tag, dockerfile, dockerHub } = shipit.config;
    const currentBranch = (
      await shipit.local("git symbolic-ref --short HEAD")
    ).stdout.replace(/\s/g, "");
    console.log("currentBranch", currentBranch);
    console.log("branch", branch);
    if (currentBranch && currentBranch !== branch) {
      return console.error("Branch not match");
    }
    if (!tag) {
      return console.error("No tag configured");
    }
    await shipit.local(
      `docker build . -f ${dockerfile} -t ${dockerHub}:${tag}`
    );
    await shipit.local(`docker push ${dockerHub}:${tag}`);
    // await shipit.remote(`./dockerctl update`, { tty: true });
  });
};
