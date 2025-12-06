import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PeriodType } from '../subscription/types';
import { GetProductsDto } from './dto/get-products.dto';

let productService: ProductService;
let productRepository;

beforeEach(async () => {
  productRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ProductService,
      {
        provide: getRepositoryToken(Product),
        useValue: productRepository,
      },
    ],
  }).compile();

  productService = module.get<ProductService>(ProductService);
});

describe('구독 상품정보 조회', () => {
  it('구독 상품정보 조회 실패', async () => {
    productRepository.find.mockRejectedValue(new Error());

    const result = productService.getProducts({
      type: PeriodType.MONTHLY,
      order: 'DESC',
    });
    await expect(result).rejects.toThrow(Error);
  });

  it('구독 상품정보 조회 성공 시 상품 정보 배열을 반환', async () => {
    // 구독 정보 mock data 미리 생성
    const mockProducts = [
      { id: 1, type: PeriodType.MONTHLY, price: 1000 },
      { id: 2, type: PeriodType.MONTHLY, price: 2000 },
    ];

    // 결과 mock data로 갈아끼우기
    productRepository.find.mockResolvedValue(mockProducts);

    // query 예시 작성
    const input: GetProductsDto = {
      type: PeriodType.MONTHLY,
      order: 'DESC',
      sortBy: undefined,
    };

    // 서비스  호출
    const result = await productService.getProducts(input);
    await expect(productRepository.find).toHaveBeenCalledWith({
      where: { type: PeriodType.MONTHLY },
      order: { createdAt: 'DESC' },
    });
    expect(result).toEqual({ result: mockProducts });
  });
});

describe('상품 생성', () => {
  it('상품 생성 중 오류가 발생하여 에러가 발생', async () => {
    const body = {
      name: 'BASIC_TEST',
      type: PeriodType.MONTHLY,
      price: 100000,
    };
    productRepository.create.mockResolvedValue(body);
    productRepository.save.mockRejectedValue(new Error());
    const result = productService.createProduct(body);
    await expect(result).rejects.toThrow(Error);
  });

  it('상품을 저장 후 생성된 엔터티에 대한 정보를 반환', async () => {
    const body = {
      name: 'BASIC_TEST',
      type: PeriodType.MONTHLY,
      price: 100000,
    };
    productRepository.create.mockResolvedValue(body);

    const currentDate = new Date();
    productRepository.save.mockResolvedValue({
      ...body,
      id: 1,
      createdAt: currentDate,
    });
    const result = await productService.createProduct(body);
    expect(result).toEqual({ ...body, id: 1, createdAt: currentDate });
  });
});
