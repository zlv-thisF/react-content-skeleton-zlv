
class Skeleton {
    public constructor(options) {
        this.options = options;
        this.initialize()
    }

    public async initialize() {
        const { headless } = this.options;
        try {
            this.scriptContent = await genScriptContent();
        }
    }

}

export default Skeleton;
