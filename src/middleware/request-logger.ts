module.exports = () => (req: any, res: any, next: any) => {
    console.info(`Request with url ${req.method}: ${req.url} has been queued`);
};
