/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractComponent } from '../../common/component/abstract.component';
import { DeleteModalComponent } from '../../common/component/modal/delete/delete.component';
import { Modal } from '../../common/domain/modal';
import { Alert } from '../../common/util/alert.util';
import { StringUtil } from '../../common/util/string.util';
import { MetadataService } from './service/metadata.service';
import { ActivatedRoute } from '@angular/router';
import { MetadataModelService } from './service/metadata.model.service';

@Component({
  selector: 'app-metadata-detail',
  templateUrl: './metadata-detail.component.html'
})
export class MetadataDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  @ViewChild('metadataName')
  private metadataName: ElementRef;

  @ViewChild('metadataDesc')
  private metadataDesc: ElementRef;


  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Protected Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Variables
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  @ViewChild(DeleteModalComponent)
  public deleteModalComponent: DeleteModalComponent;

  public tab : string = 'information';

  public isContextMenuShow : boolean = false;

  public selectedMetadataId : string;

  // 이름 에디팅여부
  public isNameEdit: boolean = false;
  public isDescEdit: boolean = false;

  // 에디팅중인 이름
  public editingName: string;

  public name : string;
  public desc : string;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Constructor
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  // 생성자
  constructor(protected element: ElementRef,
              protected metadataService  : MetadataService,
              public metadataModelService : MetadataModelService,
              protected activatedRoute : ActivatedRoute,
              protected injector: Injector) {
    super(element, injector);

    // path variable
    this.activatedRoute.params.subscribe((params) => {

      this.selectedMetadataId = params['metadataId'];

      this.getMetadataDetail();
    });
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Override Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  // Init
  public ngOnInit() {
    // Init
    super.ngOnInit();
  }

  // Destory
  public ngOnDestroy() {

    // Destory
    super.ngOnDestroy();
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Public Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  /**
   * 뒤로가기
   */
  public goBack() {
    this.router.navigateByUrl('/management/metadata/metadata');
  } // function - goBack

  /**
   * 메타데이터 상세 조회
   */
  public getMetadataDetail() {
    this.loadingShow();
    this.metadataService.getDetailMetaData(this.selectedMetadataId).then((result) => {
      this.loadingHide();
      if (result) {
        this.metadataModelService.setMetadata(result);
      }
    }).catch((error) => {
      this.loadingHide();
    })
  } // function - getMetadataDetail

  /**
   * 컨텍스트 메뉴 open/close
   */
  public showContextMenu(event) {
    event.stopImmediatePropagation();
    this.isContextMenuShow = !this.isContextMenuShow;
  } // function - showContextMenu

  /**
   * 메타데이터 삭제 모달 오픈
   */
  public confirmDelete(event) {
    event.stopImmediatePropagation();
    const modal = new Modal();
    modal.name = this.translateService.instant('msg.metadata.md.ui.delete.header');
    modal.description = this.metadataModelService.getMetadata().name;
    this.deleteModalComponent.init(modal);
  } // function - confirmDelete

  /**
   * 메타데이터 삭제
   */
  public deleteMetadata() {
    this.loadingShow();
    this.metadataService.deleteMetaData(this.selectedMetadataId).then((result) => {
      this.loadingHide();
      Alert.success(`‘${this.metadataModelService.getMetadata().name}' is deleted.`);
      this.goBack();
    }).catch((error) => {
      this.loadingHide();
      Alert.fail('Failed to delete metadata');
    })
  } // function - deleteMetadata


  /**
   * 이름 에디터 모드로 변경
   * @param $event
   */
  public onNameEdit($event: Event): void {

    $event.stopPropagation();
    this.isNameEdit = !this.isNameEdit;

    if (this.isDescEdit) {
      this.isDescEdit = false;
    }

    this.editingName = this.metadataModelService.getMetadata().name;
    this.changeDetect.detectChanges();
    this.metadataName.nativeElement.focus();
  } // function - onNameEdit

  /**
   * 이름 변경 완료후
   */
  public onNameChange(): void {

    // Edit 상태 종료
    this.isNameEdit = false;

    // Validation
    if (StringUtil.isEmpty(this.editingName.trim())) {

      Alert.info(this.translateService.instant('msg.page.alert.insert.chart.name'));
      return;
    }

    // Set
    this.name = this.editingName.trim();

    // TODO : server 호출
    this.metadataService.updateMetadata(this.selectedMetadataId, {name : this.name}).then((result) => {
      this.metadataModelService.setMetadata(result);
    }).catch((error) => {

    })
  } // function - onNameChange

  /**
   * 이름 에디터 모드 해제
   * */
  public onNameEditCancel(): void {

    // 에디트 모드가 아니라면 중지
    if (!this.isNameEdit) {
      return;
    }

    // 이름 원복
    this.editingName = this.name;

    // 에디트 모드 변경
    this.isNameEdit = !this.isNameEdit;
  } // function - onNameEditCancel


  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Protected Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  | Private Method - getter
  |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/


}

