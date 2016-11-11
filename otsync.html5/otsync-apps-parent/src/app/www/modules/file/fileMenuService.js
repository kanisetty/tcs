angular.module('fileMenuService', ['menuItemFactory', 'fileResource', 'fileService', 'File', 'appworksService'])

		.factory('$fileMenuService', ['menuItemFactory', '$fileResource', '$fileService', '$displayMessageService', 'File', '$appworksService',
			function(menuItemFactory, $fileResource, $fileService, $displayMessageService, File, $appworksService){
				var disablePromptLoading = true;
				var hasModal = true;
				var refresh = true;

				return {
					getDownloadFileMenuItem: function(node){
						return menuItemFactory.createMenuItem($displayMessageService.translate('DOWNLOAD'), !refresh, !hasModal,
								function () {
									return $fileResource.downloadAndStore(node, false);
								});
					},

					getOpenInFileMenuItem: function (node) {
						return menuItemFactory.createMenuItem($displayMessageService.translate('OPEN IN') + '...', !refresh, !hasModal,
							function () {
								return $fileResource.downloadAndStore(node, false, true);
							});
					},

					getFileMenuItemsAddVersion : function(shouldRefresh, node){
						var fileMenuItems = [];

						fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM CAMERA'), shouldRefresh, !hasModal,
							function () {
								var filename = node.getName();
								if (!new RegExp(/\.(jpe?g)$/).test(filename)) {
									filename += '.jpg';
								}
								return $fileResource.addVersion(node, new File(filename, this.data));
							},
							function () {
								return $fileService.getFileFromCamera();
							},
							!disablePromptLoading));

						fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM GALLERY'), shouldRefresh, !hasModal,
							function () {
								var filename = node.getName();
								if (!new RegExp(/\.(jpe?g)$/).test(filename)) {
									filename += '.jpg';
								}
								return $fileResource.addVersion(node, new File(filename, this.data));
							},
							function () {
								return $fileService.getFileFromGallery();
							},
							!disablePromptLoading));

						/*
						if($appworksService.deviceIsAndroid()) {
							fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM DEVICE'), shouldRefresh, !hasModal,
								function () {
									var filename = node.getName();
									if (!new RegExp(/\.(jpe?g)$/).test(filename)) {
										filename += '.jpg';
									}
									return $fileResource.addVersion(node, new File(filename, this.data));
								},
								function () {
									return $fileService.getFileFromDevice();
								},
								!disablePromptLoading));
						}
						*/

						return fileMenuItems;
					},

					getFileMenuItemsReturnsFile: function(shouldRefresh){
						var fileMenuItems = [];

						fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM CAMERA'), shouldRefresh, !hasModal,
								function () {
									return new File('photo_' + Date.now() + '.jpg', this.data);
								},
								function () {
									return $fileService.getFileFromCamera();
								},
								!disablePromptLoading));

						fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM GALLERY'), shouldRefresh, !hasModal,
								function () {
									return new File('photo_' + Date.now() + '.jpg', this.data);
								},
								function () {
									return $fileService.getFileFromGallery();
								},
								!disablePromptLoading));

						/*
						if($appworksService.deviceIsAndroid()) {
							fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM DEVICE'), shouldRefresh, !hasModal,
									function () {
										return new File('photo_' + Date.now() + '.jpg', this.data);
									},
									function () {
										return $fileService.getFileFromDevice();
									},
									!disablePromptLoading));
						}
						*/

						return fileMenuItems;
					},

					getFileMenuItemsSendToForms: function(shouldRefresh, node){
						var fileMenuItems = [];
                        var DOCUMENT_SUBTYPE = '144';
                        var addNodeOptions = {'type': DOCUMENT_SUBTYPE};

                        if(node) {
                            addNodeOptions.id = node.getID();
                        }

                        fileMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('FROM CAMERA'), shouldRefresh, !hasModal,
                                function () {
                                    addNodeOptions.fileSource = 'camera';
                                    return $fileResource.getAddNodeForm(addNodeOptions, shouldRefresh);
                                }
                        ));

                        fileMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('FROM GALLERY'), shouldRefresh, !hasModal,
                                function () {
                                    addNodeOptions.fileSource = 'gallery';
                                    return $fileResource.getAddNodeForm(addNodeOptions, shouldRefresh);
                                }
                        ));

												if($appworksService.deviceIsAndroid()) {
	                        fileMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('FROM DEVICE'), shouldRefresh, !hasModal,
	                                function () {
	                                    addNodeOptions.fileSource = 'device';
	                                    return $fileResource.getAddNodeForm(addNodeOptions, shouldRefresh);
	                                }
	                        ));
												}

						return fileMenuItems;
					},

					getFileMenuItemsWithUpload: function(node, shouldRefresh){
						var fileMenuItems = [];

						fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM CAMERA'), shouldRefresh, !hasModal,
							function () {
								return $fileResource.addDocument(node, new File('photo_' + Date.now() + '.jpg', this.data));
							},
							function () {
								return $fileService.getFileFromCamera();
							},
							!disablePromptLoading));

						fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM GALLERY'), shouldRefresh, !hasModal,
							function () {
								return $fileResource.addDocument(node, new File('photo_' + Date.now() + '.jpg', this.data));
							},
							function () {
								return $fileService.getFileFromGallery();
							},
							!disablePromptLoading));

						/*
						if($appworksService.deviceIsAndroid()) {
							fileMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FROM DEVICE'), shouldRefresh, !hasModal,
								function () {
									return $fileResource.addDocument(node, new File('photo_' + Date.now() + '.jpg', this.data));
								},
								function () {
									return $fileService.getFileFromDevice();
								},
								!disablePromptLoading));
						}
						*/

						return fileMenuItems;
					}
				}
			}]);
