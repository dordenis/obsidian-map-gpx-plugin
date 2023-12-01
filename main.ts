import {Plugin, TFile, TFolder, Vault, normalizePath} from "obsidian";
import {MapGpx} from "./src/map/map";
import {MapSettings} from "./src/map/settings";

const yaml = require('js-yaml');

// @ts-ignore
import L from 'leaflet'

export default class MapGpxPlugin extends Plugin {

	onload() {

		this.registerMarkdownCodeBlockProcessor("map",   async (source, el, ctx) => {
			const setting = this.setSettings(source);
			const map = new MapGpx(el, setting);

			const path = normalizePath(setting.track);
			const file = this.app.vault.getAbstractFileByPath(path);
			if (file instanceof TFile) {
				const xml = await this.app.vault.read(file);
				map.renderTrack(xml);
			}
		});


		this.registerMarkdownCodeBlockProcessor("maplist",   (source, el, ctx) => {
			const setting = this.setSettings(source);

			const path = normalizePath(setting.trackFolder);
			const folder = this.app.vault.getAbstractFileByPath(path);

			if (folder instanceof TFolder) {
				const table = el.createEl("table")
				let thead = table.createTHead()
				let tr = thead.createEl("tr");
				tr.createEl("th", {text: "Track", attr: {style : "width: 100%"}});
				tr.createEl("th", {text: "Name"});
				tr.createEl("th", {text: "Dist"});
				let body = table.createTBody();


				Vault.recurseChildren(folder, async (file) => {
					if (file instanceof TFile) {
						let tr = body.createEl("tr");
						let map = new MapGpx(tr.createEl("td"), setting);
						tr.createEl("td", {text: file.name});
						const xml = await this.app.vault.read(file);
						map.renderTrack(xml, tr.createEl("td"));
					}
				});
			}
		})

	}

	onunload() {
	}

	private setSettings(source: string): MapSettings
	{
		const settings = yaml.load(source);
		let local = new MapSettings();
		return {
			...local,
			...settings
		}
	}

}
