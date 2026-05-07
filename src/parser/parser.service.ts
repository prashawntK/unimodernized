import { Injectable } from "@nestjs/common";
import { ContentExtractor } from "./extractors/content.extractor";
import { AssetExtractor } from "./extractors/asset.extractor";
import { MetadataExtractor } from "./extractors/metadata.extractor";
import { NavigationExtractor } from "./extractors/navigation.extractor";


@Injectable()
export class ParserService{
    private contentExtractor = new ContentExtractor();
    private metadataExtractor = new MetadataExtractor();
    private navigationExtractor = new NavigationExtractor();
    private assetExtractor = new AssetExtractor();

    parse(html:string, baseUrl:string){
        const content = this.contentExtractor.extract(html);
        const metadata = this.metadataExtractor.extract(html);
        const navigation = this.navigationExtractor.extract(html, baseUrl);
        const assets = this.assetExtractor.extract(html);
        return {
            headings: content.headings,
            paragraphs: content.paragraphs,
            mainText: content.mainText,
            metadata,
            navigation,
            assets,
        };
  
    }
}