import {
	FileSystemAdapter,
	normalizePath,
	parseYaml, Plugin,
	TFile,
	TFolder,
	Vault
} from "obsidian";
import {DEFAULT_SETTINGS, Settings} from "./settings/settings";
import {Tab} from "./settings/tab";
import {MapGpx} from "./MapGpx";


export default class MapGpxPlugin extends Plugin {

	settings: Settings;

	async onload() {
		console.log("Load GPX plugin")

		await this.loadSettings()

		this.addSettingTab(new Tab(this.app, this))

		this.registerMarkdownCodeBlockProcessor("map",   async (source, el, ctx) => {

			const settings = await this.loadMdSettings(source);
			const map = new MapGpx(el, settings);

			let path = normalizePath(settings.track);
			const files = this.app.vault.getFiles().filter(f => (f.name === path))
			path = files[0] ? files[0].path : path;
			const file = this.app.vault.getAbstractFileByPath(path);

			if (file instanceof TFile) {
				const xml = await this.app.vault.read(file);
				map.renderTrack(xml);
			}
		});

		this.registerMarkdownCodeBlockProcessor("maplist",   async (source, el, ctx) => {
			const settings = await this.loadMdSettings(source);

			const path = normalizePath(settings.trackFolder);
			const folder = this.app.vault.getAbstractFileByPath(path);

			if (folder instanceof TFolder) {
				const table = el.createEl("table")
				let thead = table.createTHead()
				let tr = thead.createEl("tr");
				tr.createEl("th", {text: "Track", attr: {style: "width: 100%"}});
				tr.createEl("th", {text: "Name"});
				tr.createEl("th", {text: "Dist"});
				let body = table.createTBody();


				Vault.recurseChildren(folder, async (file) => {
					if (file instanceof TFile) {
						let tr = body.createEl("tr");
						let map = new MapGpx(tr.createEl("td"), settings);
						tr.createEl("td", {text: file.name});
						const xml = await this.app.vault.read(file);
						map.renderTrack(xml, tr.createEl("td"));
					}
				});
			}
		})
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
		this.settings.cacheFolder = this.getCacheFolder()
	}

	async loadMdSettings(source: string) {
		return  Object.assign({}, this.settings,  await parseYaml(source))
	}

	async saveSettings() {
		await this.saveData(this.settings);
		app.workspace.iterateAllLeaves((leaf) => {
			if (leaf.getViewState().type == "markdown") {
				leaf.rebuildView()
			}
		})
	}

	onunload() {
		super.onunload();
		console.log("Unload GPX plugin")
	}

	getCacheFolder(): string {
		if (this.settings.cacheFolder != "")  {
			return this.settings.cacheFolder
		}

		let basePath
		if (this.app.vault.adapter instanceof FileSystemAdapter) {
			basePath = this.app.vault.adapter.getBasePath()
		} else {
			throw new Error('Cannot determine base path.')
		}
		const relativePath = `${this.app.vault.configDir}/plugins/${this.manifest.id}/cache/`
		return `${basePath}/${relativePath}`
	}

}
