import React, { useRef } from "react";
import { Document } from "./app";
import styles from "./sidebar.module.css";
import { Element, useEditor } from "@craftjs/core";
import PageMenu from "./sidebar/PageMenu";
import { getIcon } from "visualui/utils/craftComponent";
import { HiPuzzlePiece } from 'react-icons/hi2'

export type SidebarProps = {
	palettes: any[],
	pages: any[],
	sendMessage: Function,
	currentPage: string
};

export const Sidebar = ({
	palettes,
	pages,
	sendMessage,
	currentPage
}: SidebarProps) => {

	const { connectors, query } = useEditor();
	function truncate_with_ellipsis(s, maxLength) {
		if (s.length > maxLength) {
			return s.substring(0, maxLength - 3) + '...';
		}
		return s;
	};

	const palettesArr = Object.keys(palettes).filter(p => p != "craft");

	const dropableCraftComponents = Object.keys(palettes).reduce((total, paletteName) => {
		const paletteElements = Object.keys(palettes[paletteName]).reduce((totalComp, componentName) => (
			{ ...totalComp, [componentName]: { dropable: true, element: palettes[paletteName][componentName], icon: getIcon(componentName) } }
		), {})
		return { ...total, [paletteName]: paletteElements }
	}, {})

	return (
		<div className={styles.sidebar}>
			<div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '4px' }}>
				<div style={{ padding: '4px', display: 'flex', flexDirection: "column", flex: 1, borderBottom: '1px solid #FFFFFF10', maxHeight: window.outerHeight * 0.5 }}>
					<p style={{ padding: '20px 0px 0px 18px', fontSize: '18px', color: 'white', fontWeight: '400' }}>Components</p>
					<div className={styles.list} style={{ overflow: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
						{
							palettesArr.map((palette, i) => {
								return (
									<div key={i} style={{ flexDirection: 'column', display: 'flex', marginBottom: '25px' }}>
										<p style={{ paddingLeft: '18px', fontSize: '12px', color: 'grey' }}>{palette}</p>
										<div className={styles.list} style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', alignContent: 'flex-start' }}>
											{
												Object.keys(dropableCraftComponents[palette]).map((componentName, i) => {
													return (dropableCraftComponents[palette][componentName].nonDeletable ?
														null
														: <div key={i} title={componentName} style={{ display: 'flex', margin: '8px', cursor: 'grab' }}>
															<div
																ref={ref => connectors.create(ref, () => {
																	return (dropableCraftComponents[palette][componentName].dropable) ?
																		<Element
																			is={dropableCraftComponents[palette][componentName].element}
																			canvas
																		></Element>
																		: React.createElement(dropableCraftComponents[palette][componentName].element)
																})}
																style={{ textAlign: 'center', marginTop: '10px', height: '50px', width: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
															>
																<HiPuzzlePiece
																	color={"#a8a29e"}
																	size={32}
																/>
																<div style={{ marginTop: '5px' }}>
																	<p style={{ fontSize: '10px', width: '100%', color: 'white' }}>
																		{truncate_with_ellipsis(componentName, 8)}
																	</p>
																</div>
															</div>
														</div>
													)
												})
											}
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
				{ <PageMenu pages={pages} sendMessage={sendMessage} currentPage={currentPage}/>}
			</div>
		</div>
	);
};
