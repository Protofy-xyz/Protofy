import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { Paragraph, SizableText, TextProps, YStack } from 'tamagui'
import { Button, ButtonProps } from 'tamagui'

export type LinkProps = Omit<NextLinkProps, 'passHref' | 'as'> &
  TextProps & {
    target?: any
    rel?: any
    title?: any
    SSR?: boolean, 
    onPressApp?:any
  }

const StyledLink = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  SSR=true,
  onPressApp=()=>{},
  ...props
}: LinkProps) => {
  return SSR?(
    <NextLink {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <SizableText cursor="pointer" tag="span" {...props}>
        {children}
      </SizableText>
    </NextLink>
  ):(
    <YStack onPress={onPressApp}>
      <SizableText cursor="pointer" tag="span" {...props}>
        {children}
      </SizableText>
    </YStack>
  )
}
export const Link = React.forwardRef((props: any, ref: any) => {
  return <StyledLink ref={ref} {...props}>
    {props.children}
  </StyledLink>;
})

const StyledParagraphLink = ({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...props
}: LinkProps) => {
  const allChildrenStrings = React.Children.toArray(children).every(
    (x) => typeof x === 'string'
  )
  return (
    <NextLink {...{ href, replace, scroll, shallow, prefetch, locale }}>
      <Paragraph
        className="paragraph-link"
        cursor="pointer"
        tag="span"
        color="$color"
        hoverStyle={{ color: '$color' }}
        {...props}
      >
        {allChildrenStrings ? children : children}
      </Paragraph>
    </NextLink>
  )
}

export const ParagraphLink = React.forwardRef((props: any, ref: any) => {
  return <StyledParagraphLink ref={ref} {...props}>
    {props.children}
  </StyledParagraphLink>;
})

export type ButtonLinkProps = Pick<
  NextLinkProps,
  'href' | 'replace' | 'scroll' | 'shallow' | 'prefetch' | 'locale'
> &
  ButtonProps & {
    target?: any
    rel?: any
    title?: any
  }



export const ButtonLink = React.forwardRef(({
  href = '',
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...props
}: ButtonLinkProps, ref:any) => {
  const linkProps = { href, replace, scroll, shallow, prefetch, locale }
  return (
    <NextLink style={{ textDecoration: 'none' }} ref={ref} {...linkProps}>
      <Button tag="span" {...props}>
        {children}
      </Button>
    </NextLink>
  )
})
